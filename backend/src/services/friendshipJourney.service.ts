export type JourneyStage =
  | "CONNECTED"
  | "CHATTED"
  | "VOICE_INTRO"
  | "MET_ONCE"
  | "MET_AGAIN"
  | "FRIENDSHIP_ESTABLISHED";

export interface Milestone {
  stage: JourneyStage;
  label: string;
  description: string;
  icon: string;
  strengthPercentage: number;
  completed: boolean;
  completedAt?: string;
}

export interface FriendshipJourneyResult {
  currentStage: JourneyStage;
  strengthScore: number; // 0 to 100
  stageLabel: string;
  nextMilestonePrompt: string;
  milestones: Milestone[];
}

export class FriendshipJourneyService {
  private static MILESTONE_DEFINITIONS: Omit<Milestone, "completed" | "completedAt">[] = [
    {
      stage: "CONNECTED",
      label: "First Connection",
      description: "Mutual connection request accepted",
      icon: "🌱",
      strengthPercentage: 15
    },
    {
      stage: "CHATTED",
      label: "First Conversation",
      description: "Exchanged messages or played an icebreaker game",
      icon: "💬",
      strengthPercentage: 35
    },
    {
      stage: "VOICE_INTRO",
      label: "Voice Intro",
      description: "Had a 1-on-1 voice conversation",
      icon: "📞",
      strengthPercentage: 50
    },
    {
      stage: "MET_ONCE",
      label: "Met in Real Life",
      description: "Checked into first real-world coffee or photowalk meetup",
      icon: "☕",
      strengthPercentage: 70
    },
    {
      stage: "MET_AGAIN",
      label: "Met Again",
      description: "Attended second meetup or community activity together",
      icon: "🔥",
      strengthPercentage: 88
    },
    {
      stage: "FRIENDSHIP_ESTABLISHED",
      label: "Friendship Circle Built",
      description: "Confirmed mutual offline friendship",
      icon: "🎉",
      strengthPercentage: 98
    }
  ];

  /**
   * Calculates Friendship Strength & Milestones trajectory
   */
  public static getJourneyDetails(completedStages: JourneyStage[] = ["CONNECTED", "CHATTED"]): FriendshipJourneyResult {
    const milestones: Milestone[] = this.MILESTONE_DEFINITIONS.map(def => {
      const isDone = completedStages.includes(def.stage);
      return {
        ...def,
        completed: isDone,
        completedAt: isDone ? new Date().toISOString() : undefined
      };
    });

    const completedList = milestones.filter(m => m.completed);
    const lastCompleted = completedList[completedList.length - 1] || milestones[0];
    const strengthScore = lastCompleted.strengthPercentage;

    let nextMilestonePrompt = "Try launching an icebreaker game to reach 35% Friendship Strength!";
    if (lastCompleted.stage === "CONNECTED") {
      nextMilestonePrompt = "Start a chat or launch an icebreaker game to unlock 35% Strength!";
    } else if (lastCompleted.stage === "CHATTED") {
      nextMilestonePrompt = "Have a quick 1-on-1 Voice Intro call to reach 50% Strength!";
    } else if (lastCompleted.stage === "VOICE_INTRO") {
      nextMilestonePrompt = "Plan your first coffee or photowalk meetup to reach 70% Strength!";
    } else if (lastCompleted.stage === "MET_ONCE") {
      nextMilestonePrompt = "Meet up again for a community event to reach 88% Strength!";
    } else if (lastCompleted.stage === "MET_AGAIN" || lastCompleted.stage === "FRIENDSHIP_ESTABLISHED") {
      nextMilestonePrompt = "🏆 Genuine friendship circle established!";
    }

    return {
      currentStage: lastCompleted.stage,
      strengthScore,
      stageLabel: lastCompleted.label,
      nextMilestonePrompt,
      milestones
    };
  }
}
