import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// POST /api/premium/subscribe - Create Razorpay Order & Activate Premium
export const activateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { planTier } = req.body; // MONTHLY, QUARTERLY, YEARLY

    if (!['MONTHLY', 'QUARTERLY', 'YEARLY'].includes(planTier)) {
      res.status(400).json({ error: 'Valid planTier (MONTHLY, QUARTERLY, YEARLY) is required' });
      return;
    }

    const priceMap: Record<string, number> = {
      MONTHLY: 299,
      QUARTERLY: 699,
      YEARLY: 1999,
    };

    const durationDays: Record<string, number> = {
      MONTHLY: 30,
      QUARTERLY: 90,
      YEARLY: 365,
    };

    // Razorpay Order Mock
    const razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    const expiresAt = new Date(Date.now() + durationDays[planTier] * 24 * 60 * 60 * 1000);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        subscriptionTier: planTier,
        subscriptionExpiresAt: expiresAt,
      },
    });

    res.json({
      success: true,
      message: `🎉 Premium unlocked! ${planTier} plan active until ${expiresAt.toLocaleDateString()}`,
      razorpayOrder: {
        orderId: razorpayOrderId,
        amount: priceMap[planTier] * 100, // in paise
        currency: 'INR',
      },
      user: {
        id: updatedUser.id,
        isPremium: updatedUser.isPremium,
        subscriptionTier: updatedUser.subscriptionTier,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to process subscription' });
  }
};

// POST /api/premium/create-ad - Business Ad Creation for Premium Members
export const createBusinessAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { title, description, targetCity, imageUrl, linkUrl } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.isPremium) {
      res.status(403).json({ error: 'Business Ads creation is restricted to Premium Members.' });
      return;
    }

    if (!title || !imageUrl) {
      res.status(400).json({ error: 'Ad title and imageUrl are required' });
      return;
    }

    const ad = await prisma.adCampaign.create({
      data: {
        userId,
        title,
        description: description || '',
        targetCity: targetCity || user.city || 'Chennai',
        imageUrl,
        linkUrl: linkUrl || null,
        status: 'ACTIVE',
      },
    });

    res.json({
      success: true,
      message: 'Business Ad Campaign published & live in nearby feeds!',
      ad,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create business ad' });
  }
};

// GET /api/premium/ads - Fetch Active Business Ads for Feed
export const getActiveAds = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = (req.query.city as string) || 'Chennai';
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: 'ACTIVE',
        OR: [{ targetCity: city }, { targetCity: 'All' }],
      },
      include: {
        user: { select: { name: true, photoUrl: true } },
      },
      take: 5,
    });

    res.json({
      success: true,
      ads,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch ads' });
  }
};

// Middleware: Require Premium Access Control
export const requirePremiumMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = (req as any).user?.id || 'demo-user-id';
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.isPremium) {
    res.status(403).json({ error: 'Premium Subscription Required' });
    return;
  }
  next();
};
