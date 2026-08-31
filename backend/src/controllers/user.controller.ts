import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { VibeMatcherService } from "../services/vibeMatcher.service";

const prisma = new PrismaClient();

export class UserController {
  /**
   * Discover nearby people with Vibe Match Score & 2FA status
   */
  public static async discoverPeople(req: Request, res: Response) {
    try {
      const currentUserId = (req as any).userId;
      const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });

      const allUsers = await prisma.user.findMany({
        where: currentUserId ? { id: { not: currentUserId } } : {}
      });

      const parsedCurrentUser = currentUser ? {
        ...currentUser,
        interests: JSON.parse(currentUser.interests || "[]"),
        hobbies: JSON.parse(currentUser.hobbies || "[]"),
        vibeTraits: JSON.parse(currentUser.vibeTraits || "[]")
      } : null;

      const discovered = allUsers.map(u => {
        const parsedUser = {
          ...u,
          interests: JSON.parse(u.interests || "[]"),
          hobbies: JSON.parse(u.hobbies || "[]"),
          vibeTraits: JSON.parse(u.vibeTraits || "[]"),
          vibeAnswers: JSON.parse(u.vibeAnswers || "{}"),
          freeLookingFor: JSON.parse(u.freeLookingFor || "[]")
        };

        const match = parsedCurrentUser
          ? VibeMatcherService.calculateMatch(parsedCurrentUser, parsedUser)
          : { matchPercentage: 90, matchingReasons: ["High interest alignment in Chennai"] };

        return {
          id: u.id,
          name: u.name,
          age: u.age,
          city: u.city,
          bio: u.bio,
          photoUrl: u.photoUrl,
          isVerified: u.isVerified,
          interests: parsedUser.interests,
          vibeTraits: parsedUser.vibeTraits,
          vibeAnswers: parsedUser.vibeAnswers,
          meetupReliabilityScore: u.meetupReliabilityScore,
          isFree: u.isFree,
          freeStartTime: u.freeStartTime,
          freeEndTime: u.freeEndTime,
          freeLookingFor: parsedUser.freeLookingFor,
          freeGroupSize: u.freeGroupSize,
          vibeMatchScore: match.matchPercentage,
          vibeMatchReasons: match.matchingReasons
        };
      });

      // Sort by Vibe Match Score descending
      discovered.sort((a, b) => b.vibeMatchScore - a.vibeMatchScore);

      return res.json(discovered);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Toggle "I'm Free" Mode
   */
  public static async toggleFreeMode(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { isFree, freeStartTime, freeEndTime, freeLookingFor, freeGroupSize } = req.body;

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          isFree: Boolean(isFree),
          freeStartTime: freeStartTime || "6:00 PM",
          freeEndTime: freeEndTime || "9:00 PM",
          freeLookingFor: JSON.stringify(freeLookingFor || ["Coffee ☕", "Walk 🚶"]),
          freeGroupSize: freeGroupSize || "2-4 people"
        }
      });

      return res.json({
        success: true,
        isFree: updated.isFree,
        freeStartTime: updated.freeStartTime,
        freeEndTime: updated.freeEndTime,
        freeLookingFor: JSON.parse(updated.freeLookingFor || "[]")
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Submit Interactive Vibe Questionnaire ("Set Your Vibe")
   */
  public static async submitVibeQuestionnaire(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { socialEnergy, meetupStyle, atmosphere, conversationStyle, availabilityStyle } = req.body;

      const vibeAnswers = {
        socialEnergy: socialEnergy || "☕ Lowkey & Chill",
        meetupStyle: meetupStyle || "👥 Small 2-4 Group",
        atmosphere: atmosphere || "🤫 Quiet & Cozy Cafes",
        conversationStyle: conversationStyle || "🗣️ Deep & Meaningful",
        availabilityStyle: availabilityStyle || "⚡ Spontaneous"
      };

      // Extract new Vibe Traits from answers
      const newVibeTraits = [
        vibeAnswers.socialEnergy.replace(/^[^\w]+/, "").trim(),
        vibeAnswers.meetupStyle.replace(/^[^\w]+/, "").trim(),
        vibeAnswers.conversationStyle.replace(/^[^\w]+/, "").trim()
      ];

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          vibeAnswers: JSON.stringify(vibeAnswers),
          vibeTraits: JSON.stringify(newVibeTraits),
          vibeVector: JSON.stringify({
            energyScore: socialEnergy?.includes("High") ? 90 : 60,
            depthScore: conversationStyle?.includes("Deep") ? 95 : 70
          })
        }
      });

      return res.json({
        success: true,
        message: "✨ Your Vibe Questionnaire responses have been saved!",
        vibeAnswers,
        vibeTraits: newVibeTraits
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
