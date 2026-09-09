import Types "../types/common";

module {
  /// Static mock catalog of destinations. This is demo data until real
  /// tourism APIs are connected; the frontend labels it as such.
  public let seedCatalog : [Types.Destination] = [
    {
      id = 1;
      name = "Paris";
      country = "France";
      category = #city;
      description = "The City of Light — world-class museums, iconic landmarks, and elegant boulevards along the Seine.";
      imageUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34";
      coordinates = { lat = 48.8566; lng = 2.3522 };
      crowdLevel = #high;
      score = 88;
      scoreFactors = { weather = 82; crowd = 55; cost = 60; traffic = 50; activities = 95 };
      bestTimeToVisit = { bestMonths = [4, 5, 6, 9, 10]; bestDays = ["Tuesday", "Wednesday", "Thursday"]; reason = "Spring and early autumn bring mild weather and thinner crowds than summer peak." };
      budget = { hotel = 220; food = 80; transport = 30; activities = 60; total = 390 };
      alternatives = [5, 8];
    },
    {
      id = 2;
      name = "Bali";
      country = "Indonesia";
      category = #beach;
      description = "Tropical island of volcanic beaches, lush rice terraces, and vibrant spiritual culture.";
      imageUrl = "https://images.unsplash.com/photo-1537996194471-e657df975ab4";
      coordinates = { lat = -8.3405; lng = 115.0920 };
      crowdLevel = #medium;
      score = 84;
      scoreFactors = { weather = 90; crowd = 65; cost = 85; traffic = 55; activities = 80 };
      bestTimeToVisit = { bestMonths = [4, 5, 6, 9, 10]; bestDays = ["Monday", "Tuesday", "Wednesday"]; reason = "Dry season (April–October) offers sunny days and calm seas." };
      budget = { hotel = 90; food = 25; transport = 15; activities = 40; total = 170 };
      alternatives = [5, 10];
    },
    {
      id = 3;
      name = "Zermatt";
      country = "Switzerland";
      category = #mountain;
      description = "Car-free alpine village beneath the Matterhorn, with year-round skiing and hiking.";
      imageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4";
      coordinates = { lat = 46.0207; lng = 7.7491 };
      crowdLevel = #medium;
      score = 86;
      scoreFactors = { weather = 75; crowd = 70; cost = 45; traffic = 85; activities = 90 };
      bestTimeToVisit = { bestMonths = [6, 7, 8, 9, 12, 1, 2]; bestDays = ["Monday", "Tuesday", "Wednesday"]; reason = "Summer for hiking and winter for skiing, with fewer crowds midweek." };
      budget = { hotel = 300; food = 90; transport = 60; activities = 120; total = 570 };
      alternatives = [6, 8];
    },
    {
      id = 4;
      name = "Tokyo";
      country = "Japan";
      category = #city;
      description = "A hyper-modern metropolis blending neon skylines, ancient temples, and world-class cuisine.";
      imageUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf";
      coordinates = { lat = 35.6762; lng = 139.6503 };
      crowdLevel = #high;
      score = 90;
      scoreFactors = { weather = 78; crowd = 50; cost = 65; traffic = 60; activities = 98 };
      bestTimeToVisit = { bestMonths = [3, 4, 10, 11]; bestDays = ["Monday", "Tuesday", "Wednesday"]; reason = "Cherry-blossom spring and crisp autumn are the most comfortable seasons." };
      budget = { hotel = 180; food = 60; transport = 25; activities = 70; total = 335 };
      alternatives = [1, 9];
    },
    {
      id = 5;
      name = "Santorini";
      country = "Greece";
      category = #beach;
      description = "Whitewashed cliffside villages, blue-domed churches, and dramatic caldera sunsets.";
      imageUrl = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff";
      coordinates = { lat = 36.3932; lng = 25.4615 };
      crowdLevel = #high;
      score = 82;
      scoreFactors = { weather = 92; crowd = 45; cost = 55; traffic = 60; activities = 75 };
      bestTimeToVisit = { bestMonths = [5, 6, 9, 10]; bestDays = ["Monday", "Tuesday", "Wednesday"]; reason = "Shoulder seasons keep the crowds manageable while the weather stays warm." };
      budget = { hotel = 200; food = 70; transport = 40; activities = 50; total = 360 };
      alternatives = [2, 10];
    },
    {
      id = 6;
      name = "Machu Picchu";
      country = "Peru";
      category = #attraction;
      description = "The legendary 15th-century Inca citadel set high in the Andes above the Urubamba Valley.";
      imageUrl = "https://images.unsplash.com/photo-1526392060635-9d6019884377";
      coordinates = { lat = -13.1631; lng = -72.5450 };
      crowdLevel = #high;
      score = 89;
      scoreFactors = { weather = 70; crowd = 40; cost = 55; traffic = 65; activities = 92 };
      bestTimeToVisit = { bestMonths = [5, 6, 7, 8, 9]; bestDays = ["Tuesday", "Wednesday", "Thursday"]; reason = "Dry season (May–September) offers clear skies and the most reliable trekking." };
      budget = { hotel = 120; food = 35; transport = 90; activities = 110; total = 355 };
      alternatives = [3, 7];
    },
    {
      id = 7;
      name = "Iceland";
      country = "Iceland";
      category = #country;
      description = "A land of fire and ice — glaciers, waterfalls, geothermal springs, and the northern lights.";
      imageUrl = "https://images.unsplash.com/photo-1504893524553-b855bce32c67";
      coordinates = { lat = 64.1466; lng = -21.9426 };
      crowdLevel = #low;
      score = 85;
      scoreFactors = { weather = 60; crowd = 90; cost = 40; traffic = 85; activities = 88 };
      bestTimeToVisit = { bestMonths = [6, 7, 8, 9]; bestDays = ["Monday", "Tuesday", "Wednesday"]; reason = "Summer offers midnight sun and accessible highlands; winter brings the aurora." };
      budget = { hotel = 180; food = 70; transport = 80; activities = 100; total = 430 };
      alternatives = [3, 6];
    },
    {
      id = 8;
      name = "Banff";
      country = "Canada";
      category = #mountain;
      description = "Turquoise glacial lakes and rugged peaks in the heart of the Canadian Rockies.";
      imageUrl = "https://images.unsplash.com/photo-1503614472-8c93d56e92ce";
      coordinates = { lat = 51.1784; lng = -115.5708 };
      crowdLevel = #medium;
      score = 87;
      scoreFactors = { weather = 72; crowd = 68; cost = 55; traffic = 75; activities = 90 };
      bestTimeToVisit = { bestMonths = [6, 7, 8, 9]; bestDays = ["Monday", "Tuesday", "Wednesday"]; reason = "Summer hiking and winter skiing, with the lakes most vivid in July." };
      budget = { hotel = 160; food = 55; transport = 50; activities = 80; total = 345 };
      alternatives = [3, 7];
    },
    {
      id = 9;
      name = "Rome";
      country = "Italy";
      category = #city;
      description = "The Eternal City — ancient ruins, Renaissance art, and timeless piazzas.";
      imageUrl = "https://images.unsplash.com/photo-1552832230-c0197dd311b5";
      coordinates = { lat = 41.9028; lng = 12.4964 };
      crowdLevel = #high;
      score = 87;
      scoreFactors = { weather = 80; crowd = 50; cost = 58; traffic = 45; activities = 93 };
      bestTimeToVisit = { bestMonths = [4, 5, 6, 9, 10]; bestDays = ["Tuesday", "Wednesday", "Thursday"]; reason = "Spring and autumn are mild and less crowded than the summer peak." };
      budget = { hotel = 190; food = 65; transport = 25; activities = 65; total = 345 };
      alternatives = [1, 4];
    },
    {
      id = 10;
      name = "Great Barrier Reef";
      country = "Australia";
      category = #attraction;
      description = "The world's largest coral reef system, teeming with marine life and vibrant dive sites.";
      imageUrl = "https://images.unsplash.com/photo-1544551763-46a013bb70d5";
      coordinates = { lat = -18.2871; lng = 147.6992 };
      crowdLevel = #medium;
      score = 83;
      scoreFactors = { weather = 85; crowd = 70; cost = 50; traffic = 80; activities = 85 };
      bestTimeToVisit = { bestMonths = [6, 7, 8, 9, 10]; bestDays = ["Monday", "Tuesday", "Wednesday"]; reason = "Winter (June–October) brings clear water and the best visibility for diving." };
      budget = { hotel = 150; food = 50; transport = 70; activities = 140; total = 410 };
      alternatives = [2, 5];
    },
  ];

  public func listDestinations(destinations : [Types.Destination]) : [Types.Destination] {
    destinations
  };

  public func getDestination(destinations : [Types.Destination], id : Nat) : ?Types.Destination {
    destinations.find(func d = d.id == id)
  };

  public func searchDestinations(destinations : [Types.Destination], searchTerm : Text, category : ?Types.Category) : [Types.Destination] {
    let term = searchTerm.toLower();
    destinations.filter(func d =
      (d.name.toLower().contains(#text term)
        or d.country.toLower().contains(#text term)
        or d.description.toLower().contains(#text term))
      and (switch (category) {
        case (?c) { d.category == c };
        case null { true };
      })
    )
  };
};
