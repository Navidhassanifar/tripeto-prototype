// data.js
const dubaiData = {
    flights: {
      "London": { min: 350, max: 550 },
      "New York": { min: 650, max: 900 },
      "Delhi": { min: 200, max: 350 },
      "Paris": { min: 400, max: 600 },
      "Tokyo": { min: 800, max: 1200 },
      "Sydney": { min: 900, max: 1300 },
      "Los Angeles": { min: 700, max: 1000 },
      "Toronto": { min: 800, max: 1100 },
      "Hong Kong": { min: 600, max: 900 },
      "São Paulo": { min: 1200, max: 1600 }
    },
    hotels: {
      "3-star": [
        { name: "Ibis Styles Dubai Airport Hotel", min: 54, max: 122 },
        { name: "City Star Hotel", min: 41, max: 95 },
        { name: "Dream Palace Hotel", min: 49, max: 108 }
      ],
      "4-star": [
        { name: "TRYP by Wyndham Dubai", min: 81, max: 176 },
        { name: "City Seasons Hotel Dubai", min: 86, max: 184 },
        { name: "Crowne Plaza Dubai", min: 122, max: 257 }
      ],
      "5-star": [
        { name: "Pullman Dubai Creek City Centre", min: 218, max: 408 },
        { name: "Grand Hyatt Dubai", min: 272, max: 544 },
        { name: "Burj Al Arab Jumeirah", min: 1632, max: 2720 }
      ]
    },
    activities: {
      paid: [
        { name: "Desert Safari", category: "adventure", min: 41, max: 68, groupSuitability: ["friends", "family"] },
        { name: "Burj Khalifa (124th Floor)", category: "culture", min: 41, max: 54, groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Aquaventure Waterpark", category: "water", min: 81, max: 95, groupSuitability: ["friends", "family"] },
        { name: "Jet Skiing", category: "water", min: 54, max: 95, groupSuitability: ["friends", "couple"] },
        { name: "Dinner Cruise", category: "food", min: 41, max: 81, groupSuitability: ["couple", "family", "colleagues"] },
        { name: "Legoland Dubai", category: "family", min: 68, max: 81, groupSuitability: ["family"] },
        { name: "Indoor Skiing (Ski Dubai)", category: "adventure", min: 54, max: 95, groupSuitability: ["friends", "family"] }
      ],
      free: [
        { name: "Dubai Fountain Show", category: "culture", groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Jumeirah Beach", category: "water", groupSuitability: ["friends", "couple", "family"] },
        { name: "Gold Souk & Spice Souk", category: "culture", groupSuitability: ["friends", "couple", "family", "colleagues"] }
      ]
    },
    transport: [
      { name: "Metro", min: 0.81, max: 4 },
      { name: "Taxi", min: 3.26, max: 10 },
      { name: "Nol Card (Daily)", min: 6.24, max: 6.24 }
    ]
  };