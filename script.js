// script.js
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

  // Collect inputs
  const origin = document.getElementById('origin').value;
  const dates = document.getElementById('dates').value;
  const budget = parseFloat(document.getElementById('budget').value);
  const travelers = parseInt(document.getElementById('travelers').value);
  const relationship = travelers > 1 ? document.getElementById('relationship').value : 'solo';
  const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(input => input.value);

  // Calculate trip duration (simplified: assume dates are in "March 10-13" format)
  const [start, end] = dates.split('-').map(date => date.trim());
  const days = parseInt(end.split(' ')[1]) - parseInt(start.split(' ')[1]) + 1; // e.g., 13-10 = 3 days

  // Generate trip plan
  const plan = generateTripPlan(origin, budget, travelers, relationship, interests, days);

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
    // If flight cost exceeds budget, adjust
    plan.flights = { name: `Flight from ${origin}`, cost: flightCost, note: "Flight cost adjusted due to budget" };
  } else {
    plan.flights = { name: `Flight from ${origin}`, cost: flightCost };
  }
  totalCost += flightCost;

  // Step 2: Hotel (40% of budget)
  const hotelBudget = (budget * 0.4) - (totalCost - flightBudget); // Adjust based on flight cost
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

  // Step 3: Transport (fixed cost for simplicity)
  const transport = dubaiData.transport.find(t => t.name === "Nol Card (Daily)");
  const transportCost = transport.min * days;
  plan.transport = { name: transport.name, cost: transportCost, days: days };
  totalCost += transportCost;

  // Step 4: Activities (remaining budget)
  let remainingBudget = budget - totalCost;
  if (remainingBudget < 0) remainingBudget = 0; // Don't overspend yet
  const availableActivities = dubaiData.activities.paid.filter(activity =>
    activity.groupSuitability.includes(relationship) &&
    (interests.length === 0 || interests.includes(activity.category))
  ).sort((a, b) => a.min - b.min); // Sort by cost

  // Distribute activities across days
  const activitiesPerDay = Math.ceil(days / 2); // At least one activity every other day
  for (let day = 1; day <= days && remainingBudget > 0; day++) {
    const activity = availableActivities.find(a => a.min <= remainingBudget);
    if (activity) {
      plan.activities.push({ day, name: activity.name, cost: activity.min });
      remainingBudget -= activity.min;
      totalCost += activity.min;
    } else {
      // Add a free activity if budget is tight
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
    <h3>Flights</h3>
    <p class="plan-item">${plan.flights.name}: <span class="cost">$${plan.flights.cost}</span></p>
    ${plan.flights.note ? `<p>${plan.flights.note}</p>` : ''}
  `;

  document.getElementById('hotel-plan').innerHTML = `
    <h3>Hotel</h3>
    <p class="plan-item">${plan.hotel.name}, $${plan.hotel.perNight}/night, ${plan.hotel.nights} nights: <span class="cost">$${plan.hotel.cost}</span></p>
  `;

  document.getElementById('activities-plan').innerHTML = `
    <h3>Activities</h3>
    ${plan.activities.map(activity => `
      <p class="plan-item">Day ${activity.day}: ${activity.name}: <span class="cost">$${activity.cost}</span></p>
    `).join('')}
  `;

  document.getElementById('transport-plan').innerHTML = `
    <h3>Transport</h3>
    <p class="plan-item">${plan.transport.name} (${plan.transport.days} days): <span class="cost">$${plan.transport.cost}</span></p>
  `;

  const statusText = plan.budgetStatus === "within" ? "(Under Budget)"
    : plan.budgetStatus === "slight-over" ? `(Over by $${plan.totalCost - budget})`
    : `(Over by $${plan.totalCost - budget})`;
  document.getElementById('total-cost').innerHTML = `
    Total: $${plan.totalCost} / $${budget} <span class="${plan.budgetStatus}">${statusText}</span>
  `;
}

// Function to go back to form
function editPlan() {
  formSection.style.display = 'block';
  planSection.style.display = 'none';
}