export interface RescueRecommendation {
  id: string;
  type: "COFFEE" | "WALKING" | "GAMING";
  title: string;
  categoryIcon: string;
  distanceKm: number;
  venueName: string;
  time: string;
  attendeesCount: number;
  matchReason: string;
}

export interface MeetupGuaranteeStatus {
  meetupId: string;
  meetupTitle: string;
  confirmedCount: number;
  minCapacity: number;
  isThresholdBreached: boolean;
  rescueNotice: string;
  recommendations: RescueRecommendation[];
}

export class RescueService {
  /**
   * Evaluates Meetup Guarantee status and generates nearby fallback social options
   */
  public static evaluateMeetupGuarantee(
    meetupId: string,
    meetupTitle: string,
    confirmedCount: number,
    minCapacity: number = 2
  ): MeetupGuaranteeStatus {
    const isThresholdBreached = confirmedCount < minCapacity;

    const recommendations: RescueRecommendation[] = [
      {
        id: "res-coffee-1",
        type: "COFFEE",
        title: "☕ Saturday Coffee & Chill Meetup",
        categoryIcon: "☕",
        distanceKm: 0.7,
        venueName: "Blue Tokai Coffee, Nungambakkam",
        time: "6:30 PM Today",
        attendeesCount: 3,
        matchReason: "Matches your coffee & chill vibe preferences"
      },
      {
        id: "res-walk-2",
        type: "WALKING",
        title: "🚶 Sunset Beach Photowalk & Evening Walk",
        categoryIcon: "🚶",
        distanceKm: 1.2,
        venueName: "Marina Beach Promenade",
        time: "5:30 PM Today",
        attendeesCount: 12,
        matchReason: "Active community group with high attendance"
      },
      {
        id: "res-game-3",
        type: "GAMING",
        title: "🎮 Casual Board Games & Conversation",
        categoryIcon: "🎮",
        distanceKm: 1.5,
        venueName: "Board Game Cafe, T. Nagar",
        time: "7:00 PM Today",
        attendeesCount: 4,
        matchReason: "Open spots available for spontaneous join"
      }
    ];

    return {
      meetupId,
      meetupTitle,
      confirmedCount,
      minCapacity,
      isThresholdBreached,
      rescueNotice: isThresholdBreached
        ? "🛟 Meetup Guarantee Activated: Attendance is below minimum threshold. You will never be left stranded!"
        : "✅ Meetup capacity confirmed.",
      recommendations
    };
  }

  public static getRescueOptions(category?: string) {
    return this.evaluateMeetupGuarantee("demo-meetup", "Saturday Coffee", 1, 2).recommendations;
  }
}
