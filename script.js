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
        const duration = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calculate days
        document.getElementById('duration').value = duration;
      }
    }
  });
  
  // Initialize form and sections
  const formSection = document.getElementById('form-section');
  const planSection = document.getElementById('plan-section');
  const form = document.getElementById('trip-form');
  const travelersInput = document.getElementById('travelers');
  const relationshipGroup = document.getElementById('relationship-group');
  
  // Show relationship dropdown if travelers > 1
  travelersInput.addEventListener('input', () => {
    const travelers = parseInt(travelersInput.value);
    relationshipGroup.style.display = travelers > 1 ? 'block' : 'none';
  });
  
  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  
    // Validate inputs
    const origin = document.getElementById('origin').value;
    const dates = document.getElementById('dates').value;
    const budget = parseFloat(document.getElementById('budget').value);
    const travelers = parseInt(document.getElementById('travelers').value);
    const duration = parseInt(document.getElementById('duration').value);
    const relationship = travelers > 1 ? document.getElementById('relationship').value : 'solo';
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(input => input.value);
  
    if (!dates || !budget || !travelers || duration < 1) {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Generate trip plan
    const plan = generateTripPlan(origin, budget, travelers, relationship, interests, duration);
  
    // Display plan
    displayTripPlan(plan, budget);
    formSection.style.display = 'none';
    planSection.style.display = 'block';
  });
  
  // Function to generate the trip plan
  function generateTripPlan(origin, budget, travelers, relationship, interests, days) {
    let totalCost = 0;
    const plan = {
      flights: {},
      hotel: {},
      activities: [],
      transport: {}
    };
  
    // Step 1: Flights (40% of budget)
    const flightBudget = budget * 0.4;
    const flightData = dubaiData.flights[origin];
    const flightCost = flightData.min; // Use minimum price for budget focus
    if (flightCost > flightBudget) {
      plan.flights = { name: `Flight from ${origin}`, cost: flightCost, note: "Flight cost adjusted due to budget" };
    } else {
      plan.flights = { name: `Flight from ${origin}`, cost: flightCost };
    }
    totalCost += flightCost;
  
    // Step 2: Hotel (40% of budget)
    const hotelBudget = (budget * 0.4) - (totalCost - flightBudget);
    const hotelPerNightBudget = hotelBudget / days;
    let hotel;
    if (hotelPerNightBudget < 80) {
      hotel = dubaiData.hotels['3-star'].find(h => h.min <= hotelPerNightBudget) || dubaiData.hotels['3-star'][0];
    } else if (hotelPerNightBudget < 200) {
      hotel = dubaiData.hotels['4-star'].find(h => h.min <= hotelPerNightBudget) || dubaiData.hotels['4-star'][0];
    } else {
      hotel = dubaiData.hotels['5-star'].find(h => h.min <= hotelPerNightBudget) || dubaiData.hotels['5-star'][0];
    }
    const hotelCost = hotel.min * days;
    plan.hotel = { name: hotel.name, cost: hotelCost, nights: days, perNight: hotel.min };
    totalCost += hotelCost;
  
    // Step 3: Transport
    const transport = dubaiData.transport.find(t => t.name === "Nol Card (Daily)");
    const transportCost = transport.min * days;
    plan.transport = { name: transport.name, cost: transportCost, days: days };
    totalCost += transportCost;
  
    // Step 4: Activities
    let remainingBudget = budget - totalCost;
    if (remainingBudget < 0) remainingBudget = 0;
    const availableActivities = dubaiData.activities.paid.filter(activity =>
      activity.groupSuitability.includes(relationship) &&
      (interests.length === 0 || interests.includes(activity.category))
    ).sort((a, b) => a.min - b.min);
  
    for (let day = 1; day <= days && remainingBudget > 0; day++) {
      const activity = availableActivities.find(a => a.min <= remainingBudget);
      if (activity) {
        plan.activities.push({ day, name: activity.name, cost: activity.min });
        remainingBudget -= activity.min;
        totalCost += activity.min;
      } else {
        const freeActivity = dubaiData.activities.free.find(a =>
          a.groupSuitability.includes(relationship) &&
          (interests.length === 0 || interests.includes(a.category))
        );
        if (freeActivity) {
          plan.activities.push({ day, name: freeActivity.name, cost: 0 });
        }
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
      <p class="mb-1">${plan.hotel.name}, $${plan.hotel.perNight}/night, ${plan.hotel.nights} nights: <span class="text-[#FFA500] font-bold">$${plan.hotel.cost}</span></p>
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