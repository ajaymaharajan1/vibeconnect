import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/connections/send
export const sendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requesterId = (req as any).user?.id || 'demo-user-id';
    const { targetUserId } = req.body;

    if (!targetUserId) {
      res.status(400).json({ error: 'targetUserId is required' });
      return;
    }

    if (requesterId === targetUserId) {
      res.status(400).json({ error: 'Cannot send connection request to yourself' });
      return;
    }

    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId, receiverId: targetUserId },
          { requesterId: targetUserId, receiverId: requesterId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'blocked') {
        res.status(403).json({ error: 'Cannot connect with this user' });
        return;
      }
      if (existing.status === 'accepted') {
        res.status(400).json({ error: 'You are already connected!' });
        return;
      }
      if (existing.status === 'pending') {
        res.status(400).json({ error: 'Connection request is already pending' });
        return;
      }
      const updated = await prisma.connection.update({
        where: { id: existing.id },
        data: { requesterId, receiverId: targetUserId, status: 'pending' },
      });
      res.json({ success: true, message: 'Connection request re-sent', connection: updated });
      return;
    }

    const connection = await prisma.connection.create({
      data: {
        requesterId,
        receiverId: targetUserId,
        status: 'pending',
      },
    });

    res.json({
      success: true,
      message: 'Connection request sent successfully',
      connection,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to send connection request' });
  }
};

// POST /api/connections/accept
export const acceptRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { connectionId, targetUserId } = req.body;

    let connection = null;
    if (connectionId) {
      connection = await prisma.connection.findUnique({ where: { id: connectionId } });
    } else if (targetUserId) {
      connection = await prisma.connection.findFirst({
        where: {
          requesterId: targetUserId,
          receiverId: userId,
          status: 'pending',
        },
      });
    }

    if (!connection) {
      res.status(404).json({ error: 'Pending connection request not found' });
      return;
    }

    const updated = await prisma.connection.update({
      where: { id: connection.id },
      data: { status: 'accepted' },
    });

    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        type: 'DIRECT',
        members: {
          every: {
            userId: { in: [connection.requesterId, connection.receiverId] },
          },
        },
      },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          type: 'DIRECT',
          name: 'Direct Chat',
          members: {
            create: [
              { userId: connection.requesterId },
              { userId: connection.receiverId },
            ],
          },
        },
      });
    }

    res.json({
      success: true,
      message: 'Connection accepted! You can now chat.',
      connection: updated,
      chatRoomId: chatRoom.id,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to accept request' });
  }
};

// POST /api/connections/reject
export const rejectRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { connectionId, targetUserId } = req.body;

    let connection = null;
    if (connectionId) {
      connection = await prisma.connection.findUnique({ where: { id: connectionId } });
    } else if (targetUserId) {
      connection = await prisma.connection.findFirst({
        where: {
          requesterId: targetUserId,
          receiverId: userId,
        },
      });
    }

    if (!connection) {
      res.status(404).json({ error: 'Connection request not found' });
      return;
    }

    const updated = await prisma.connection.update({
      where: { id: connection.id },
      data: { status: 'rejected' },
    });

    res.json({
      success: true,
      message: 'Connection request rejected',
      connection: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to reject request' });
  }
};

// POST /api/connections/cancel
export const cancelRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { targetUserId } = req.body;

    const connection = await prisma.connection.findFirst({
      where: {
        requesterId: userId,
        receiverId: targetUserId,
        status: 'pending',
      },
    });

    if (!connection) {
      res.status(404).json({ error: 'Pending request not found to cancel' });
      return;
    }

    const updated = await prisma.connection.update({
      where: { id: connection.id },
      data: { status: 'cancelled' },
    });

    res.json({
      success: true,
      message: 'Connection request cancelled',
      connection: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to cancel request' });
  }
};

// POST /api/connections/block
export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { targetUserId } = req.body;

    if (!targetUserId) {
      res.status(400).json({ error: 'targetUserId is required' });
      return;
    }

    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: userId, receiverId: targetUserId },
          { requesterId: targetUserId, receiverId: userId },
        ],
      },
    });

    let result;
    if (existing) {
      result = await prisma.connection.update({
        where: { id: existing.id },
        data: { requesterId: userId, receiverId: targetUserId, status: 'blocked' },
      });
    } else {
      result = await prisma.connection.create({
        data: {
          requesterId: userId,
          receiverId: targetUserId,
          status: 'blocked',
        },
      });
    }

    res.json({
      success: true,
      message: 'User blocked successfully',
      connection: result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to block user' });
  }
};

// POST /api/connections/unblock
export const unblockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { targetUserId } = req.body;

    const connection = await prisma.connection.findFirst({
      where: {
        requesterId: userId,
        receiverId: targetUserId,
        status: 'blocked',
      },
    });

    if (connection) {
      await prisma.connection.delete({ where: { id: connection.id } });
    }

    res.json({
      success: true,
      message: 'User unblocked successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to unblock user' });
  }
};

// GET /api/connections/list
export const getMyConnections = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';

    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
      include: {
        requester: { select: { id: true, name: true, photoUrl: true, city: true } },
        receiver: { select: { id: true, name: true, photoUrl: true, city: true } },
      },
    });

    const formatted = connections.map((conn) => {
      const isRequester = conn.requesterId === userId;
      const otherUser = isRequester ? conn.receiver : conn.requester;
      return {
        connectionId: conn.id,
        status: conn.status,
        isRequester,
        user: otherUser,
        createdAt: conn.createdAt,
      };
    });

    res.json({
      success: true,
      connections: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch connections' });
  }
};

export const ConnectionController = {
  sendConnectRequest: sendRequest,
  respondToRequest: acceptRequest,
  getMyConnections: getMyConnections,
  getFriendshipJourney: (req: Request, res: Response) => {
    res.json({
      success: true,
      journey: {
        stage: 'Voice Intro Completed',
        friendshipScore: 78,
        milestones: [
          { key: 'connected', label: 'Connected', completed: true },
          { key: 'chatted', label: 'Chatted', completed: true },
          { key: 'voice', label: 'Voice Intro', completed: true },
          { key: 'met_once', label: 'Met Once', completed: false },
          { key: 'met_again', label: 'Met Again', completed: false },
          { key: 'established', label: 'Friendship Established', completed: false },
        ]
      }
    });
  }
};
