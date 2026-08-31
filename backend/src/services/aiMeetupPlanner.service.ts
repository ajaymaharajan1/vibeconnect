export interface MeetupCategoryOption {
  id: string;
  name: string;
  icon: string;
}

export interface AIMeetupVenueSuggestion {
  id: string;
  spotName: string;
  category: string;
  address: string;
  expectedCost: string;
  distanceKm: number;
  travelTime: string;
  safetyRating: number; // e.g. 4.9 out of 5
  safetyLabel: string;
  vibeDescription: string;
  bestMeetingTime: string;
  photoUrl: string;
}

export class AIMeetupPlannerService {
  public static categories: MeetupCategoryOption[] = [
    { id: "coffee", name: "Coffee & Cafes ☕", icon: "☕" },
    { id: "fitness", name: "Fitness & Parks 🏋️", icon: "🏋️" },
    { id: "tech", name: "Tech & Coworking 💻", icon: "💻" },
    { id: "movies", name: "Movies & Culture 🎬", icon: "🎬" }
  ];

  private static venueDatabase: Record<string, AIMeetupVenueSuggestion[]> = {
    coffee: [
      {
        id: "v-coffee-1",
        spotName: "Blue Tokai Coffee Roasters",
        category: "Coffee & Cafes ☕",
        address: "Khadder Nawaz Khan Road, Nungambakkam, Chennai",
        expectedCost: "₹250 - ₹400 / person",
        distanceKm: 1.2,
        travelTime: "5 mins drive (12 mins walk)",
        safetyRating: 4.9,
        safetyLabel: "🛡️ Public & High Security Area",
        vibeDescription: "Cozy artisanal coffee shop with outdoor seating, great wifi, and relaxed music.",
        bestMeetingTime: "5:00 PM - 7:30 PM",
        photoUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "v-coffee-2",
        spotName: "Amethyst Cafe & Garden",
        category: "Coffee & Cafes ☕",
        address: "Whites Road, Royapettah, Chennai",
        expectedCost: "₹350 - ₹600 / person",
        distanceKm: 2.1,
        travelTime: "8 mins drive",
        safetyRating: 4.8,
        safetyLabel: "🛡️ Safe Heritage Garden Setting",
        vibeDescription: "Lush green courtyard cafe ideal for long, peaceful conversations and photography.",
        bestMeetingTime: "4:30 PM - 6:30 PM",
        photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
      }
    ],
    fitness: [
      {
        id: "v-fit-1",
        spotName: "Marina Beach Promenade & Lighthouse",
        category: "Fitness & Parks 🏋️",
        address: "Kamajar Salai, Marina Beach, Chennai",
        expectedCost: "Free (₹30 for coconut water)",
        distanceKm: 1.8,
        travelTime: "7 mins drive",
        safetyRating: 4.7,
        safetyLabel: "🛡️ Well-lit Public Promenade",
        vibeDescription: "Ocean breeze running & walking path with sunset views and fresh juice stalls.",
        bestMeetingTime: "5:30 AM - 7:00 AM or 5:00 PM - 6:30 PM",
        photoUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "v-fit-2",
        spotName: "Chetpet Eco Park & Jogging Track",
        category: "Fitness & Parks 🏋️",
        address: "EVR Salai, Chetpet, Chennai",
        expectedCost: "₹20 Park Ticket",
        distanceKm: 2.8,
        travelTime: "10 mins drive",
        safetyRating: 4.9,
        safetyLabel: "🛡️ Gated Eco Park & CCTV",
        vibeDescription: "Scenic lakefront jogging track, outdoor fitness zone, and boating deck.",
        bestMeetingTime: "6:00 AM - 8:00 AM",
        photoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
      }
    ],
    tech: [
      {
        id: "v-tech-1",
        spotName: "Workafella Coworking Lounge",
        category: "Tech & Coworking 💻",
        address: "T. Nagar / Nungambakkam, Chennai",
        expectedCost: "₹300 Day Pass / Cafe Spot",
        distanceKm: 1.5,
        travelTime: "6 mins drive",
        safetyRating: 5.0,
        safetyLabel: "🛡️ Verified Commercial Hub",
        vibeDescription: "High-speed wifi, ergonomic seating, tech networking lounge, and complimentary tea.",
        bestMeetingTime: "2:00 PM - 6:00 PM",
        photoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
      }
    ],
    movies: [
      {
        id: "v-mov-1",
        spotName: "Sathyam Cinemas (SPI Cinemas)",
        category: "Movies & Culture 🎬",
        address: "Royapettah High Road, Chennai",
        expectedCost: "₹180 - ₹350 / ticket",
        distanceKm: 2.4,
        travelTime: "9 mins drive",
        safetyRating: 4.9,
        safetyLabel: "🛡️ Premium Multiplex Mall",
        vibeDescription: "Iconic cinema house famous for world-class popcorn, multiplex comfort, and movie trivia.",
        bestMeetingTime: "6:30 PM Show",
        photoUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
      }
    ]
  };

  public static planMeetup(categoryKey: string): AIMeetupVenueSuggestion[] {
    const list = this.venueDatabase[categoryKey.toLowerCase()];
    if (list && list.length > 0) return list;
    return this.venueDatabase["coffee"];
  }
}
