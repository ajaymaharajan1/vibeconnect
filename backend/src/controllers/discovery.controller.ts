import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateVibeMatch } from '../services/vibeMatcher.service';

const prisma = new PrismaClient();

// GET /api/discovery/people - Paginated Search & Recommendation Engine
export const discoverPeople = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = (req as any).user?.id || 'demo-user-id';
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const minAge = req.query.minAge ? parseInt(req.query.minAge as string, 10) : 18;
    const maxAge = req.query.maxAge ? parseInt(req.query.maxAge as string, 10) : 99;
    const distanceKmFilter = req.query.distanceKm ? parseFloat(req.query.distanceKm as string) : 50;
    const cityFilter = req.query.city as string;
    const vibeFilter = req.query.vibe as string;
    const interestFilter = req.query.interest as string;
    const sortBy = (req.query.sortBy as string) || 'vibe_match'; // vibe_match, distance, reliability

    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });

    // Fetch candidate users
    const allUsers = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        age: { gte: minAge, lte: maxAge },
        ...(cityFilter && cityFilter !== 'All' ? { city: { equals: cityFilter } } : {}),
      },
    });

    // Score & Filter
    const scoredUsers = allUsers.map((user) => {
      const match = currentUser
        ? calculateVibeMatch(currentUser, user)
        : { matchPercentage: 75, breakdown: { interestScore: 25, activityScore: 20, personalityScore: 15, distanceScore: 15 }, matchingReasons: ['Active community member'] };

      const userInterests: string[] = typeof user.interests === 'string' ? JSON.parse(user.interests || '[]') : (user.interests || []);

      return {
        id: user.id,
        name: user.name,
        age: user.age,
        city: user.city,
        bio: user.bio,
        photoUrl: user.photoUrl,
        personalityType: user.personalityType,
        socialIntentions: user.socialIntentions,
        interests: userInterests,
        meetupReliabilityScore: user.meetupReliabilityScore,
        vibeMatch: match,
        distanceKm: match.breakdown.distanceScore > 0 ? (20 - match.breakdown.distanceScore) / 0.4 : 12.0,
      };
    });

    // Filter by interest tag if specified
    let filtered = scoredUsers;
    if (interestFilter) {
      filtered = filtered.filter((u) =>
        u.interests.some((i) => i.toLowerCase().includes(interestFilter.toLowerCase()))
      );
    }

    if (vibeFilter) {
      filtered = filtered.filter((u) =>
        u.personalityType.toLowerCase().includes(vibeFilter.toLowerCase()) ||
        u.bio.toLowerCase().includes(vibeFilter.toLowerCase())
      );
    }

    // Filter by max distance slider
    filtered = filtered.filter((u) => u.distanceKm <= distanceKmFilter);

    // Sorting
    if (sortBy === 'vibe_match') {
      filtered.sort((a, b) => b.vibeMatch.matchPercentage - a.vibeMatch.matchPercentage);
    } else if (sortBy === 'distance') {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'reliability') {
      filtered.sort((a, b) => b.meetupReliabilityScore - a.meetupReliabilityScore);
    }

    // Pagination slice
    const totalCount = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedResults = filtered.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      results: paginatedResults,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to discover people' });
  }
};

// GET /api/discovery/communities
export const discoverCommunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;

    const communities = await prisma.community.findMany({
      where: {
        ...(category && category !== 'All' ? { category } : {}),
        ...(search ? { name: { contains: search } } : {}),
      },
      include: {
        members: true,
        owner: { select: { name: true, photoUrl: true } },
      },
    });

    res.json({
      success: true,
      communities: communities.map((c) => ({
        ...c,
        memberCount: c.members.length,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to discover communities' });
  }
};

// GET /api/discovery/events
export const discoverEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string;
    const events = await prisma.event.findMany({
      where: {
        ...(category && category !== 'All' ? { category } : {}),
      },
      include: {
        creator: { select: { name: true, photoUrl: true } },
      },
    });

    res.json({
      success: true,
      events,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to discover events' });
  }
};

// GET /api/discovery/meetups
export const discoverMeetups = async (req: Request, res: Response): Promise<void> => {
  try {
    const meetups = await prisma.meetup.findMany({
      include: {
        creator: { select: { name: true, photoUrl: true } },
        rsvps: { include: { user: { select: { name: true, photoUrl: true } } } },
      },
    });

    res.json({
      success: true,
      meetups,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to discover meetups' });
  }
};
