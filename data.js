// data.js
const dubaiData = {
    flights: {
      "New York (JFK)": { min: 650, max: 900, peakMonths: ["November", "December", "February"] },
      "London (LHR)": { min: 350, max: 550, peakMonths: ["December", "January", "February"] },
      "Paris (CDG)": { min: 400, max: 600, peakMonths: ["December", "January", "August"] },
      "Tokyo (NRT)": { min: 800, max: 1200, peakMonths: ["December", "January", "March"] },
      "Sydney (SYD)": { min: 900, max: 1300, peakMonths: ["December", "January", "February"] },
      "Los Angeles (LAX)": { min: 700, max: 1000, peakMonths: ["November", "December", "February"] },
      "Delhi (DEL)": { min: 200, max: 350, peakMonths: ["December", "January", "July"] },
      "Toronto (YYZ)": { min: 800, max: 1100, peakMonths: ["December", "February", "March"] },
      "Hong Kong (HKG)": { min: 600, max: 900, peakMonths: ["December", "January", "February"] },
      "São Paulo (GRU)": { min: 1200, max: 1600, peakMonths: ["December", "January", "February"] }
    },
    hotels: {
      "5-star": [
        { name: "Burj Al Arab Jumeirah", min: 1632, max: 2720 },
        { name: "Atlantis The Palm", min: 408, max: 816 },
        { name: "Jumeirah Beach Hotel", min: 326, max: 680 },
        { name: "Armani Hotel Dubai", min: 489, max: 952 },
        { name: "Ritz-Carlton Dubai", min: 408, max: 761 },
        { name: "Waldorf Astoria Dubai Palm Jumeirah", min: 435, max: 816 },
        { name: "Raffles Dubai", min: 353, max: 680 },
        { name: "Grand Hyatt Dubai", min: 272, max: 544 },
        { name: "One&Only The Palm", min: 680, max: 1224 },
        { name: "Pullman Dubai Creek City Centre", min: 218, max: 408 }
      ],
      "4-star": [
        { name: "Copthorne Hotel Dubai", min: 95, max: 190 },
        { name: "Novotel Al Barsha Dubai", min: 108, max: 217 },
        { name: "Aloft City Centre Deira", min: 103, max: 203 },
        { name: "Rose Rayhaan by Rotana", min: 122, max: 244 },
        { name: "Sofitel Dubai Downtown", min: 163, max: 326 },
        { name: "Jumeirah Creekside Hotel", min: 136, max: 272 },
        { name: "TRYP by Wyndham Dubai", min: 81, max: 176 },
        { name: "City Seasons Hotel Dubai", min: 86, max: 184 },
        { name: "Crowne Plaza Dubai", min: 122, max: 257 },
        { name: "Mina A'Salam Madinat Jumeirah", min: 163, max: 353 }
      ],
      "3-star": [
        { name: "Ibis Styles Dubai Airport Hotel", min: 54, max: 122 },
        { name: "City Star Hotel", min: 41, max: 95 },
        { name: "Dream Palace Hotel", min: 49, max: 108 },
        { name: "Sun and Sands Hotel", min: 54, max: 122 },
        { name: "Lavender Hotel Dubai", min: 60, max: 136 },
        { name: "Mayfair Hotel", min: 68, max: 149 },
        { name: "Royal Falcon Hotel", min: 49, max: 114 },
        { name: "Zain International Hotel", min: 54, max: 122 },
        { name: "Premier Inn Dubai Dragon Mart", min: 62, max: 136 },
        { name: "Saffron Hotel", min: 46, max: 108 }
      ]
    },
    activities: {
      paid: [
        { name: "Wild Wadi Waterpark", category: "water", min: 68, max: 81, groupSuitability: ["friends", "family"] },
        { name: "Aquaventure Waterpark (Atlantis)", category: "water", min: 81, max: 95, groupSuitability: ["friends", "family"] },
        { name: "Flyboarding", category: "water", min: 81, max: 108, groupSuitability: ["friends", "couple"] },
        { name: "Jet Skiing (Jumeirah Beach)", category: "water", min: 54, max: 95, groupSuitability: ["friends", "couple"] },
        { name: "Dubai Aquarium & Underwater Zoo", category: "family", min: 41, max: 68, groupSuitability: ["family", "friends"] },
        { name: "Desert Safari (Standard Package)", category: "adventure", min: 41, max: 68, groupSuitability: ["friends", "family"] },
        { name: "Hot Air Balloon Ride", category: "adventure", min: 244, max: 326, groupSuitability: ["friends", "couple"] },
        { name: "Skydiving (Skydive Dubai)", category: "adventure", min: 489, max: 680, groupSuitability: ["friends", "couple"] },
        { name: "Dune Buggy Ride", category: "adventure", min: 136, max: 217, groupSuitability: ["friends", "family"] },
        { name: "Indoor Skiing (Ski Dubai)", category: "adventure", min: 54, max: 95, groupSuitability: ["friends", "family"] },
        { name: "Dubai Miracle Garden", category: "culture", min: 14, max: 20, groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Motiongate Dubai", category: "family", min: 68, max: 81, groupSuitability: ["family", "friends"] },
        { name: "Legoland Dubai", category: "family", min: 68, max: 81, groupSuitability: ["family"] },
        { name: "KidZania Dubai", category: "family", min: 41, max: 54, groupSuitability: ["family"] },
        { name: "Dubai Dolphinarium", category: "family", min: 27, max: 41, groupSuitability: ["family"] },
        { name: "Burj Khalifa (124th Floor)", category: "culture", min: 41, max: 54, groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Museum of the Future", category: "culture", min: 39, max: 41, groupSuitability: ["friends", "family", "colleagues"] },
        { name: "Dubai Frame", category: "culture", min: 14, max: 20, groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Al Fahidi Historical District", category: "culture", min: 0, max: 5, groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Dubai Museum (Al Fahidi Fort)", category: "culture", min: 1, max: 3, groupSuitability: ["friends", "family", "colleagues"] },
        { name: "Helicopter Tour (15-25 min)", category: "luxury", min: 190, max: 326, groupSuitability: ["friends", "couple"] },
        { name: "Dinner Cruise (Dhow Cruise)", category: "food", min: 41, max: 81, groupSuitability: ["couple", "family", "colleagues"] },
        { name: "Infinity Pool (Aura Skypool)", category: "luxury", min: 54, max: 108, groupSuitability: ["friends", "couple"] },
        { name: "Burj Al Arab Dining Experience", category: "food", min: 136, max: 272, groupSuitability: ["couple", "colleagues"] },
        { name: "Yacht Rental (per hour)", category: "luxury", min: 163, max: 408, groupSuitability: ["friends", "couple"] }
      ],
      free: [
        { name: "Dubai Fountain Show", category: "culture", groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Jumeirah Beach (Public Area)", category: "water", groupSuitability: ["friends", "couple", "family"] },
        { name: "Al Seef Heritage Area", category: "culture", groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Al Fahidi Historical District", category: "culture", groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Ras Al Khor Wildlife Sanctuary", category: "nature", groupSuitability: ["friends", "family"] },
        { name: "Kite Beach", category: "water", groupSuitability: ["friends", "family"] },
        { name: "The Walk at JBR", category: "culture", groupSuitability: ["friends", "couple", "family"] },
        { name: "Dubai Marina Walk", category: "culture", groupSuitability: ["friends", "couple", "family"] },
        { name: "Gold Souk & Spice Souk", category: "culture", groupSuitability: ["friends", "couple", "family", "colleagues"] },
        { name: "Hatta Dam (Scenic Viewpoint)", category: "nature", groupSuitability: ["friends", "family"] }
      ]
    },
    transport: [
      { name: "Metro", min: 0.81, max: 4, groupSuitability: ["all"], description: "Fast, air-conditioned, covers most areas" },
      { name: "Bus", min: 0.81, max: 4, groupSuitability: ["all"], description: "Affordable, connects metro and local areas" },
      { name: "Tram", min: 0.81, max: 3, groupSuitability: ["all"], description: "Runs in Marina and Al Sufouh areas" },
      { name: "Taxi (Standard)", min: 3.26, max: 10, groupSuitability: ["all"], description: "Metered, widely available" },
      { name: "Water Bus", min: 0.54, max: 1.36, groupSuitability: ["all"], description: "Scenic rides across Dubai Creek/Marina" },
      { name: "Abra (Traditional Boat)", min: 0.27, max: 0.54, groupSuitability: ["all"], description: "Short creek crossing, budget-friendly" },
      { name: "Nol Card (Silver)", min: 6.80, max: 6.80, groupSuitability: ["all"], description: "Prepaid card for metro, bus, tram" },
      { name: "Nol Card (Red - Daily)", min: 6.24, max: 6.24, groupSuitability: ["all"], description: "Unlimited daily pass for public transport" },
      { name: "Monorail (Palm Jumeirah)", min: 4, max: 7, groupSuitability: ["all"], description: "Connects Palm to mainland" },
      { name: "Water Taxi", min: 14, max: 54, groupSuitability: ["luxury"], description: "Private, luxury water transport" }
    ]
  };