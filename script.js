// script.js
// Initialize Flatpickr for date range selection
flatpickr("#dates", {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: function(selectedDates) {
      if (selectedDates.length === 2) {
        const startDate = selectedDates[0];
        const endDate = selectedDates[1];
        const calculatedDuration = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calculate days
        const durationInput = document.getElementById('duration');
        // Only update if the user hasn't manually edited the field
        if (!durationInput.dataset.userEdited) {
          durationInput.value = calculatedDuration;
        }
      }
    }
  });
  
  // Fallback if Flatpickr fails to load
  if (!window.flatpickr) {
    console.error('Flatpickr failed to load. Falling back to manual date input.');
    document.getElementById('dates').removeAttribute('readonly');
    document.getElementById('dates').placeholder = 'Enter dates manually (e.g., 2025-03-10 to 2025-03-12)';
  }
  
  // Track if the user manually edits the duration
  document.getElementById('duration').addEventListener('input', function() {
    this.dataset.userEdited = true; // Mark as user-edited
  });
  
  // Reset user-edited flag when dates change
  document.getElementById('dates').addEventListener('change', function() {
    document.getElementById('duration').dataset.userEdited = false;
  });
  
  // Initialize form and sections
  const formSection = document.getElementById('form-section');
  const planSection = document.getElementById('plan-section');
  const form = document.getElementById('trip-form');
  const travelersInput = document.getElementById('travelers');
  const relationshipGroup = document.getElementById('relationship-group');
  
  // Show relationship dropdown if travelers > 1
  travelersInput.addEventListener('input', () => {
    const travelers = parseInt(travelersInput.value) || 0;
    relationshipGroup.style.display = travelers > 1 ? 'block' : 'none';
  });
  
  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  
    // Collect inputs
    const origin = document.getElementById('origin').value;
    const dates = document.getElementById('dates').value;
    const budget = parseFloat(document.getElementById('budget').value) || 0;
    const travelers = parseInt(document.getElementById('travelers').value) || 0;
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const relationship = travelers > 1 ? document.getElementById('relationship').value : 'solo';
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(input => input.value);
  
    // Validate inputs
    if (!dates || !budget || budget <= 0 || !travelers || travelers < 1 || !duration || duration < 1) {
      alert('Please fill in all required fields with valid values.');
      return;
    }
  
    // Validate duration against dates
    const [startDateStr, endDateStr] = dates.split(' to ');
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (isNaN(startDate) || isNaN(endDate)) {
      alert('Please select a valid date range.');
      return;
    }
    const calculatedDuration = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (duration < calculatedDuration) {
      alert(`Duration (${duration} days) cannot be less than the date range (${calculatedDuration} days). Please adjust.`);
      return;
    }
  
    // Generate trip plan
    const plan = generateTripPlan(origin, budget, travelers, relationship, interests, duration, dates);
  
    // Display plan
    displayTripPlan(plan, budget);
    formSection.style.display = 'none';
    planSection.style.display = 'block';
  });
  
  // Function to determine budget tier
  function getBudgetTier(budget) {
    if (budget < 1000) return "budget";
    if (budget <= 3000) return "mid-range";
    return "luxury";
  }
  
  // Function to generate the trip plan
  function generateTripPlan(origin, budget, travelers, relationship, interests, days, dates) {
    let totalCost = 0;
    const plan = {
      flights: {},
      hotel: {},
      activities: [],
      transport: {}
    };
  
    // Determine budget tier for dynamic planning
    const budgetTier = getBudgetTier(budget);
  
    // Step 1: Flights (adjust cost based on dates and budget tier)
    const flightData = dubaiData.flights[origin];
    let flightCost;
    const [startDateStr] = dates.split(' to ');
    const startDate = new Date(startDateStr);
    const month = startDate.toLocaleString('default', { month: 'long' });
    // Adjust flight cost for peak months
    if (flightData.peakMonths.includes(month)) {
      flightCost = flightData.max;
    } else {
      flightCost = flightData.min;
    }
    // For luxury tier, assume business class (approximated as 1.5x max cost)
    if (budgetTier === "luxury") {
      flightCost = flightData.max * 1.5;
    }
    plan.flights = { name: `Flight from ${origin}`, cost: flightCost };
    totalCost += flightCost;
  
    // Step 2: Hotel (scale based on budget tier)
    const remainingBudgetAfterFlights = budget - totalCost;
    const hotelPerNightBudget = (remainingBudgetAfterFlights * 0.5) / days; // Allocate ~50% of remaining budget to hotel
    let hotelChoices;
    if (budgetTier === "budget") {
      hotelChoices = dubaiData.hotels["3-star"];
    } else if (budgetTier === "mid-range") {
      hotelChoices = [...dubaiData.hotels["3-star"], ...dubaiData.hotels["4-star"]];
    } else {
      hotelChoices = [...dubaiData.hotels["4-star"], ...dubaiData.hotels["5-star"]];
    }
    // Sort hotels by cost and pick one that fits the budget
    hotelChoices.sort((a, b) => a.min - b.min);
    let hotel = hotelChoices.find(h => h.min <= hotelPerNightBudget) || hotelChoices[0];
    // For luxury tier, prefer higher-end hotels if budget allows
    if (budgetTier === "luxury" && remainingBudgetAfterFlights > 1000) {
      hotelChoices.sort((a, b) => b.max - a.max); // Sort by max cost for luxury
      hotel = hotelChoices.find(h => h.max <= hotelPerNightBudget * 1.5) || hotelChoices[0];
    }
    const hotelCost = (budgetTier === "luxury" ? hotel.max : hotel.min) * days;
    plan.hotel = { name: hotel.name, cost: hotelCost, nights: days, perNight: hotelCost / days };
    totalCost += hotelCost;
  
    // Step 3: Transport (choose based on budget tier)
    let remainingBudget = budget - totalCost;
    let transport;
    if (budgetTier === "budget") {
      transport = dubaiData.transport.find(t => t.name === "Abra (Traditional Boat)") || dubaiData.transport.find(t => t.name === "Metro");
    } else if (budgetTier === "mid-range") {
      transport = dubaiData.transport.find(t => t.name === "Nol Card (Red - Daily)") || dubaiData.transport.find(t => t.name === "Metro");
    } else {
      transport = dubaiData.transport.find(t => t.name === "Water Taxi") || dubaiData.transport.find(t => t.name === "Taxi (Standard)");
    }
    const transportCost = (budgetTier === "luxury" ? transport.max : transport.min) * days;
    plan.transport = { name: transport.name, cost: transportCost, days: days };
    totalCost += transportCost;
  
    // Step 4: Activities (prioritize Interests, balance cost and preference)
    remainingBudget = budget - totalCost;
    if (remainingBudget < 0) remainingBudget = 0;
  
    // Filter activities based on group suitability and interests
    const matchingPaidActivities = dubaiData.activities.paid.filter(activity =>
      activity.groupSuitability.includes(relationship) &&
      (interests.length === 0 || interests.includes(activity.category))
    );
    const matchingFreeActivities = dubaiData.activities.free.filter(activity =>
      activity.groupSuitability.includes(relationship) &&
      (interests.length === 0 || interests.includes(activity.category))
    );
  
    // Sort paid activities by preference: matching interests first, then by cost
    const sortedPaidActivities = matchingPaidActivities.sort((a, b) => {
      const aMatchesInterest = interests.includes(a.category) ? 1 : 0;
      const bMatchesInterest = interests.includes(b.category) ? 1 : 0;
      if (aMatchesInterest !== bMatchesInterest) return bMatchesInterest - aMatchesInterest;
      return a.min - b.min; // If same interest match, sort by cost
    });
  
    // Distribute activities across days
    for (let day = 1; day <= days; day++) {
      if (remainingBudget > 0) {
        // Try to add a paid activity that matches interests and fits the budget
        const activity = sortedPaidActivities.find(a => a.min <= remainingBudget);
        if (activity) {
          const activityCost = budgetTier === "luxury" && a.max ? a.max : a.min;
          plan.activities.push({ day, name: activity.name, cost: activityCost });
          remainingBudget -= activityCost;
          totalCost += activityCost;
          continue; // Skip to next day after adding a paid activity
        }
      }
      // If budget is tight or no paid activity fits, add a free activity
      const freeActivity = matchingFreeActivities[Math.floor(Math.random() * matchingFreeActivities.length)];
      if (freeActivity) {
        plan.activities.push({ day, name: freeActivity.name, cost: 0 });
      } else {
        plan.activities.push({ day, name: "Free time to explore Dubai", cost: 0 });
      }
    }
  
    // Step 5: Check $50 overage
    plan.totalCost = totalCost;
    plan.budgetStatus = totalCost <= budget ? "within"
      : totalCost <= budget + 50 ? "slight-over"
      : "over-limit";
  
    return plan;
  }
  
  // Function to display the trip plan
  function displayTripPlan(plan, budget) {
    document.getElementById('flights-plan').innerHTML = `
      <h3 class="text-xl font-semibold text-[#0055A4] mb-2">Flights</h3>
      <p class="mb-1">${plan.flights.name}: <span class="text-[#FFA500] font-bold">$${plan.flights.cost}</span></p>
      ${plan.flights.note ? `<p class="text-sm text-gray-600">${plan.flights.note}</p>` : ''}
    `;
  
    document.getElementById('hotel-plan').innerHTML = `
      <h3 class="text-xl font-semibold text-[#0055A4] mb-2">Hotel</h3>
      <p class="mb-1">${plan.hotel.name}, $${plan.hotel.perNight.toFixed(2)}/night, ${plan.hotel.nights} nights: <span class="text-[#FFA500] font-bold">$${plan.hotel.cost}</span></p>
    `;
  
    document.getElementById('activities-plan').innerHTML = `
      <h3 class="text-xl font-semibold text-[#0055A4] mb-2">Activities</h3>
      ${plan.activities.map(activity => `
        <p class="mb-1">Day ${activity.day}: ${activity.name}: <span class="text-[#FFA500] font-bold">$${activity.cost}</span></p>
      `).join('')}
    `;
  
    document.getElementById('transport-plan').innerHTML = `
      <h3 class="text-xl font-semibold text-[#0055A4] mb-2">Transport</h3>
      <p class="mb-1">${plan.transport.name} (${plan.transport.days} days): <span class="text-[#FFA500] font-bold">$${plan.transport.cost}</span></p>
    `;
  
    const statusText = plan.budgetStatus === "within" ? "(Under Budget)"
      : plan.budgetStatus === "slight-over" ? `(Over by $${plan.totalCost - budget})`
      : `(Over by $${plan.totalCost - budget})`;
    const statusClass = plan.budgetStatus === "within" ? "text-green-600"
      : plan.budgetStatus === "slight-over" ? "text-[#FFA500]"
      : "text-red-600";
    document.getElementById('total-cost').innerHTML = `
      Total: $${plan.totalCost} / $${budget} <span class="${statusClass}">${statusText}</span>
    `;
  }
  
  // Function to go back to form
  function editPlan() {
    formSection.style.display = 'block';
    planSection.style.display = 'none';
  }