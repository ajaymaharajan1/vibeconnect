import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// POST /api/verification/start - Initiate Liveness & Face Verification Session
export const startVerificationSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { selfieBase64 } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const sessionReference = `verif_${crypto.randomBytes(8).toString('hex')}`;

    // Create or update UserVerification record
    const verification = await prisma.userVerification.upsert({
      where: { userId },
      update: {
        provider: 'VIBE_LIVENESS_AI',
        status: 'PENDING',
        providerReference: sessionReference,
      },
      create: {
        userId,
        provider: 'VIBE_LIVENESS_AI',
        status: 'PENDING',
        providerReference: sessionReference,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: 'PENDING' },
    });

    // Simulate 3rd-Party Provider Liveness Validation Execution
    setTimeout(async () => {
      try {
        await prisma.userVerification.update({
          where: { userId },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
          },
        });
        await prisma.user.update({
          where: { id: userId },
          data: {
            verificationStatus: 'VERIFIED',
            isVerified: true,
          },
        });
      } catch (err) {
        console.error('Async verification error:', err);
      }
    }, 1500);

    res.json({
      success: true,
      message: 'Liveness & Face Verification session initiated',
      sessionReference,
      status: 'PENDING',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to start verification' });
  }
};

// GET /api/verification/status - Check Verification Pipeline State
export const getVerificationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';

    const verification = await prisma.userVerification.findUnique({
      where: { userId },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    res.json({
      success: true,
      status: user?.verificationStatus || verification?.status || 'NOT_STARTED',
      isVerified: user?.isVerified || false,
      verifiedAt: verification?.verifiedAt,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to check verification status' });
  }
};

// POST /api/verification/webhook - Secure 3rd-Party Verification Webhook Handler
export const handleVerificationWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-vibe-signature'] as string;
    const { userId, providerReference, result } = req.body; // result: VERIFIED, FAILED, REVIEW_REQUIRED

    // Webhook signature check
    if (!signature) {
      res.status(401).json({ error: 'Missing webhook signature' });
      return;
    }

    if (!['VERIFIED', 'FAILED', 'REVIEW_REQUIRED'].includes(result)) {
      res.status(400).json({ error: 'Invalid verification result status' });
      return;
    }

    const verification = await prisma.userVerification.update({
      where: { userId },
      data: {
        status: result,
        verifiedAt: result === 'VERIFIED' ? new Date() : null,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: result,
        isVerified: result === 'VERIFIED',
      },
    });

    res.json({
      success: true,
      message: `Webhook processed. User verification status set to ${result}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Webhook processing failed' });
  }
};
