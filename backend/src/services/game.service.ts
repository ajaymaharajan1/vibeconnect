export interface IcebreakerQuestion {
  id: string;
  gameType: "WOULD_YOU_RATHER" | "THIS_OR_THAT" | "TWO_TRUTHS" | "CONVERSATION_STARTER";
  category?: string;
  question: string;
  options?: string[];
}

export class GameService {
  private static questions: IcebreakerQuestion[] = [
    {
      id: "wyr-1",
      gameType: "WOULD_YOU_RATHER",
      question: "Would you rather travel the world for a year 🌎 or receive \$50,000 to invest 💰?",
      options: ["Travel the World 🌎", "Invest \$50,000 💰"]
    },
    {
      id: "wyr-2",
      gameType: "WOULD_YOU_RATHER",
      question: "Would you rather attend a 50,000 person music festival 🎵 or a cozy 5-person dinner party 🕯️?",
      options: ["Music Festival 🎵", "Cozy Dinner 🕯️"]
    },
    {
      id: "tot-1",
      gameType: "THIS_OR_THAT",
      question: "Morning Coffee ☕ vs Evening Tea 🫖",
      options: ["Morning Coffee ☕", "Evening Tea 🫖"]
    },
    {
      id: "tot-2",
      gameType: "THIS_OR_THAT",
      question: "Spontaneous Weekend Trips 🚗 vs Planned Vacations 🗓️",
      options: ["Spontaneous Trips 🚗", "Planned Vacations 🗓️"]
    },
    {
      id: "ttal-1",
      gameType: "TWO_TRUTHS",
      question: "Guess which one is the Lie! 🕵️‍♂️",
      options: [
        "1. I have run a full marathon 🏃",
        "2. I have met a famous film director 🎬",
        "3. I cannot swim in deep water 🏊"
      ]
    }
  ];

  public static getRandomGame(gameType: string): IcebreakerQuestion {
    const filtered = this.questions.filter(q => q.gameType === gameType);
    if (filtered.length === 0) return this.questions[0];
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  public static getConversationStarter(sharedInterests: string[]): string {
    if (sharedInterests.includes("Photography")) {
      return "You both love Photography 📸! Try asking: 'What's the best photo you've ever taken?'";
    }
    if (sharedInterests.includes("Fitness")) {
      return "You both love Fitness 🏋️! Try asking: 'What is your favorite workout spot or routine in the city?'";
    }
    if (sharedInterests.includes("Movies")) {
      return "You both love Movies 🎬! Try asking: 'What movie can you watch 10 times without getting bored?'";
    }
    if (sharedInterests.includes("Coffee")) {
      return "You both love Coffee ☕! Try asking: 'What's your go-to café recommendation around here?'";
    }
    return "Try asking: 'What brought you to the city, and what's your favorite thing to do on weekends?'";
  }
}
