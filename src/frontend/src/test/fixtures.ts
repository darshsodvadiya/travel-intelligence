import { Category, CrowdLevel, type Destination } from "@/types";

export const paris: Destination = {
  id: 1n,
  name: "Paris",
  country: "France",
  category: Category.city,
  description:
    "The City of Light — world-class museums, iconic landmarks, and elegant boulevards along the Seine.",
  imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  coordinates: { lat: 48.8566, lng: 2.3522 },
  crowdLevel: CrowdLevel.high,
  score: 88n,
  scoreFactors: {
    weather: 82n,
    crowd: 55n,
    cost: 60n,
    traffic: 50n,
    activities: 95n,
  },
  bestTimeToVisit: {
    bestMonths: [4n, 5n, 6n, 9n, 10n],
    bestDays: ["Tuesday", "Wednesday", "Thursday"],
    reason:
      "Spring and early autumn bring mild weather and thinner crowds than summer peak.",
  },
  budget: {
    hotel: 220n,
    food: 80n,
    transport: 30n,
    activities: 60n,
    total: 390n,
  },
  alternatives: [5n, 8n],
};

export const santorini: Destination = {
  id: 5n,
  name: "Santorini",
  country: "Greece",
  category: Category.beach,
  description:
    "Whitewashed cliffside villages, blue-domed churches, and dramatic caldera sunsets.",
  imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
  coordinates: { lat: 36.3932, lng: 25.4615 },
  crowdLevel: CrowdLevel.high,
  score: 82n,
  scoreFactors: {
    weather: 92n,
    crowd: 45n,
    cost: 55n,
    traffic: 60n,
    activities: 75n,
  },
  bestTimeToVisit: {
    bestMonths: [5n, 6n, 9n, 10n],
    bestDays: ["Monday", "Tuesday", "Wednesday"],
    reason:
      "Shoulder seasons keep the crowds manageable while the weather stays warm.",
  },
  budget: {
    hotel: 200n,
    food: 70n,
    transport: 40n,
    activities: 50n,
    total: 360n,
  },
  alternatives: [2n, 10n],
};

export const banff: Destination = {
  id: 8n,
  name: "Banff",
  country: "Canada",
  category: Category.mountain,
  description:
    "Turquoise glacial lakes and rugged peaks in the heart of the Canadian Rockies.",
  imageUrl: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce",
  coordinates: { lat: 51.1784, lng: -115.5708 },
  crowdLevel: CrowdLevel.medium,
  score: 87n,
  scoreFactors: {
    weather: 72n,
    crowd: 68n,
    cost: 55n,
    traffic: 75n,
    activities: 90n,
  },
  bestTimeToVisit: {
    bestMonths: [6n, 7n, 8n, 9n],
    bestDays: ["Monday", "Tuesday", "Wednesday"],
    reason:
      "Summer hiking and winter skiing, with the lakes most vivid in July.",
  },
  budget: {
    hotel: 160n,
    food: 55n,
    transport: 50n,
    activities: 80n,
    total: 345n,
  },
  alternatives: [3n, 7n],
};

export const iceland: Destination = {
  id: 7n,
  name: "Iceland",
  country: "Iceland",
  category: Category.country,
  description:
    "A land of fire and ice — glaciers, waterfalls, geothermal springs, and the northern lights.",
  imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
  coordinates: { lat: 64.1466, lng: -21.9426 },
  crowdLevel: CrowdLevel.low,
  score: 85n,
  scoreFactors: {
    weather: 60n,
    crowd: 90n,
    cost: 40n,
    traffic: 85n,
    activities: 88n,
  },
  bestTimeToVisit: {
    bestMonths: [6n, 7n, 8n, 9n],
    bestDays: ["Monday", "Tuesday", "Wednesday"],
    reason:
      "Summer offers midnight sun and accessible highlands; winter brings the aurora.",
  },
  budget: {
    hotel: 180n,
    food: 70n,
    transport: 80n,
    activities: 100n,
    total: 430n,
  },
  alternatives: [3n, 6n],
};

export const allDestinations: Destination[] = [
  paris,
  santorini,
  banff,
  iceland,
];
