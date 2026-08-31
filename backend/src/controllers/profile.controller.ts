import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateVibeMatch } from '../services/vibeMatcher.service';

const prisma = new PrismaClient();

// GET /api/profile/me
export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: parseUserJsonFields(user),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
};

// PUT /api/profile/update
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const {
      name,
      age,
      city,
      bio,
      photoUrl,
      languages,
      interests,
      hobbies,
      activities,
      socialIntentions,
      personalityType,
    } = req.body;

    // Validation: Profile Picture mandatory check for complete profiles
    if (!photoUrl && photoUrl !== undefined) {
      res.status(400).json({ error: 'Profile picture is mandatory for completing profile setup.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(age && { age: Number(age) }),
        ...(city && { city }),
        ...(bio !== undefined && { bio }),
        ...(photoUrl && { photoUrl }),
        ...(languages && { languages: JSON.stringify(languages) }),
        ...(interests && { interests: JSON.stringify(interests) }),
        ...(hobbies && { hobbies: JSON.stringify(hobbies) }),
        ...(activities && { activities: JSON.stringify(activities) }),
        ...(socialIntentions && { socialIntentions }),
        ...(personalityType && { personalityType }),
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: parseUserJsonFields(updated),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
};

// POST /api/profile/photo
export const uploadProfilePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { photoUrl } = req.body;

    if (!photoUrl) {
      res.status(400).json({ error: 'photoUrl is required' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { photoUrl },
    });

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      photoUrl: updated.photoUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload photo' });
  }
};

// GET /api/profile/user/:userId - Public Profile view with Vibe Match & Privacy controls
export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = (req as any).user?.id || 'demo-user-id';
    const { userId } = req.params;

    const [currentUser, targetUser, connection] = await Promise.all([
      prisma.user.findUnique({ where: { id: currentUserId } }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.connection.findFirst({
        where: {
          OR: [
            { requesterId: currentUserId, receiverId: userId },
            { requesterId: userId, receiverId: currentUserId },
          ],
        },
      }),
    ]);

    if (!targetUser) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    // Privacy logic
    const privacy = typeof targetUser.privacySettings === 'string'
      ? JSON.parse(targetUser.privacySettings || '{}')
      : targetUser.privacySettings || {};

    const isMutualFriend = connection?.status === 'accepted';

    if (privacy.onlyFriendsCanView && !isMutualFriend && currentUserId !== userId) {
      res.status(403).json({
        error: 'This profile is private. Only mutual connections can view full details.',
        isPrivate: true,
        userSummary: {
          id: targetUser.id,
          name: targetUser.name,
          photoUrl: targetUser.photoUrl,
          city: targetUser.city,
        },
      });
      return;
    }

    // Calculate Vibe Compatibility
    const vibeMatch = currentUser ? calculateVibeMatch(currentUser, targetUser) : null;

    const parsedTarget = parseUserJsonFields(targetUser);

    if (privacy.hideDistance) {
      parsedTarget.lat = null;
      parsedTarget.lng = null;
    }

    res.json({
      success: true,
      user: parsedTarget,
      vibeMatch,
      connectionState: connection ? connection.status : 'none',
      isRequester: connection ? connection.requesterId === currentUserId : false,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch public profile' });
  }
};

// PUT /api/profile/privacy - Update Privacy Settings
export const updatePrivacySettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { hideDistance, hideOnlineStatus, onlyFriendsCanView } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const currentPrivacy = typeof user.privacySettings === 'string'
      ? JSON.parse(user.privacySettings || '{}')
      : user.privacySettings || {};

    const newPrivacy = {
      ...currentPrivacy,
      ...(hideDistance !== undefined && { hideDistance }),
      ...(hideOnlineStatus !== undefined && { hideOnlineStatus }),
      ...(onlyFriendsCanView !== undefined && { onlyFriendsCanView }),
    };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { privacySettings: JSON.stringify(newPrivacy) },
    });

    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      privacySettings: newPrivacy,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update privacy settings' });
  }
};

function parseUserJsonFields(user: any) {
  return {
    ...user,
    languages: typeof user.languages === 'string' ? JSON.parse(user.languages || '[]') : user.languages,
    interests: typeof user.interests === 'string' ? JSON.parse(user.interests || '[]') : user.interests,
    hobbies: typeof user.hobbies === 'string' ? JSON.parse(user.hobbies || '[]') : user.hobbies,
    activities: typeof user.activities === 'string' ? JSON.parse(user.activities || '[]') : user.activities,
    privacySettings: typeof user.privacySettings === 'string' ? JSON.parse(user.privacySettings || '{}') : user.privacySettings,
  };
}
