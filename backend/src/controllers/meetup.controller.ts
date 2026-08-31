import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RescueService } from "../services/rescue.service";
import { ReliabilityService } from "../services/reliability.service";
import { AIMeetupPlannerService } from "../services/aiMeetupPlanner.service";

const prisma = new PrismaClient();

export class MeetupController {
  // --- Meetups ---
  public static async getMeetups(req: Request, res: Response) {
    try {
      const meetups = await prisma.meetup.findMany({
        include: {
          creator: true,
          community: true,
          rsvps: { include: { user: true } }
        },
        orderBy: { createdAt: "desc" }
      });

      return res.json(meetups.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        venueName: m.venueName,
        time: m.time,
        maxCapacity: m.maxCapacity,
        minCapacity: m.minCapacity,
        status: m.status,
        creatorName: m.creator.name,
        creatorPhoto: m.creator.photoUrl,
        creatorReliability: m.creator.meetupReliabilityScore,
        communityName: m.community?.name || null,
        rsvpsCount: m.rsvps.length,
        attendees: m.rsvps.map(r => ({
          userId: r.userId,
          name: r.user.name,
          photoUrl: r.user.photoUrl,
          status: r.status
        }))
      })));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async createMeetup(req: Request, res: Response) {
    try {
      const creatorId = (req as any).userId;
      const { title, description, venueName, time, maxCapacity, communityId } = req.body;

      const meetup = await prisma.meetup.create({
        data: {
          title,
          description: description || "Casual social meetup",
          venueName,
          time,
          maxCapacity: Number(maxCapacity) || 4,
          creatorId,
          communityId: communityId || null,
          rsvps: {
            create: {
              userId: creatorId,
              status: "CONFIRMED"
            }
          }
        }
      });

      return res.status(201).json({ success: true, meetup });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async rsvpMeetup(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { meetupId, status } = req.body;

      const meetup = await prisma.meetup.findUnique({
        where: { id: meetupId },
        include: { rsvps: true }
      });

      if (!meetup) return res.status(404).json({ error: "Meetup not found" });

      const rsvp = await prisma.meetupRSVP.upsert({
        where: {
          meetupId_userId: { meetupId, userId }
        },
        update: {
          status,
          checkedInAt: status === "CHECKED_IN" ? new Date() : undefined
        },
        create: {
          meetupId,
          userId,
          status,
          checkedInAt: status === "CHECKED_IN" ? new Date() : undefined
        }
      });

      if (status === "CHECKED_IN") {
        const userRSVPs = await prisma.meetupRSVP.findMany({ where: { userId } });
        const confirmed = userRSVPs.filter(r => r.status === "CONFIRMED" || r.status === "CHECKED_IN").length;
        const checkedIn = userRSVPs.filter(r => r.status === "CHECKED_IN").length;
        
        const newScore = ReliabilityService.calculateScore({
          confirmedCount: confirmed,
          checkInCount: checkedIn,
          cancellationCount: 0,
          noShowCount: 0
        });

        await prisma.user.update({
          where: { id: userId },
          data: { meetupReliabilityScore: newScore }
        });
      }

      return res.json({ success: true, rsvp });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * AI Meetup Planner Endpoint (Category: coffee, fitness, tech, movies)
   */
  public static async planAIMeetup(req: Request, res: Response) {
    try {
      const { category } = req.body;
      const suggestions = AIMeetupPlannerService.planMeetup(category || "coffee");
      return res.json({
        categorySelected: category || "coffee",
        suggestions
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getRescueRecommendations(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({ where: { id: (req as any).userId } });
      const lat = user?.lat || 13.0827;
      const lng = user?.lng || 80.2707;

      const recommendations = RescueService.getRescueOptions();
      return res.json({
        notice: "Your meetup currently has low attendance. Here are nearby active meetups & events you can join instead!",
        recommendations
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getCommunities(req: Request, res: Response) {
    try {
      const communities = await prisma.community.findMany({
        include: { owner: true, members: true, events: true }
      });
      return res.json(communities);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getEvents(req: Request, res: Response) {
    try {
      const events = await prisma.event.findMany({
        include: { creator: true, community: true },
        orderBy: { createdAt: "desc" }
      });
      return res.json(events);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
