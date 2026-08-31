import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GameService } from "../services/game.service";

const prisma = new PrismaClient();

export class ChatController {
  public static async getRooms(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const memberships = await prisma.chatMember.findMany({
        where: { userId },
        include: {
          room: {
            include: {
              members: {
                include: { user: true }
              },
              messages: {
                take: 1,
                orderBy: { createdAt: "desc" }
              }
            }
          }
        }
      });

      const rooms = memberships.map(m => {
        const room = m.room;
        const otherMember = room.members.find(mem => mem.userId !== userId)?.user;
        const lastMsg = room.messages[0];

        return {
          id: room.id,
          type: room.type,
          name: room.type === "DIRECT" ? otherMember?.name : room.name,
          photoUrl: room.type === "DIRECT" ? otherMember?.photoUrl : null,
          lastMessage: lastMsg ? lastMsg.content : "No messages yet",
          lastMessageTime: lastMsg ? lastMsg.createdAt : room.createdAt,
          otherMemberId: otherMember?.id
        };
      });

      return res.json(rooms);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getMessages(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const messages = await prisma.message.findMany({
        where: { roomId },
        orderBy: { createdAt: "asc" },
        include: { sender: true }
      });

      return res.json(messages.map(m => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.sender.name,
        senderPhoto: m.sender.photoUrl,
        content: m.content,
        type: m.type,
        metadata: m.metadata ? JSON.parse(m.metadata) : null,
        createdAt: m.createdAt
      })));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async sendMessage(req: Request, res: Response) {
    try {
      const senderId = (req as any).userId;
      const { roomId, content, type, metadata } = req.body;

      const msg = await prisma.message.create({
        data: {
          roomId,
          senderId,
          content,
          type: type || "TEXT",
          metadata: metadata ? JSON.stringify(metadata) : null
        },
        include: { sender: true }
      });

      return res.status(201).json({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.sender.name,
        senderPhoto: msg.sender.photoUrl,
        content: msg.content,
        type: msg.type,
        metadata: metadata || null,
        createdAt: msg.createdAt
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Launch an in-chat icebreaker game
   */
  public static async launchGame(req: Request, res: Response) {
    try {
      const senderId = (req as any).userId;
      const { roomId, gameType } = req.body; // WOULD_YOU_RATHER, THIS_OR_THAT, TWO_TRUTHS

      const question = GameService.getRandomGame(gameType);

      // Create a game card message in chat
      const msg = await prisma.message.create({
        data: {
          roomId,
          senderId,
          content: `🎮 Started game: ${gameType.replace(/_/g, " ")}!`,
          type: "GAME_CARD",
          metadata: JSON.stringify(question)
        },
        include: { sender: true }
      });

      return res.status(201).json({
        success: true,
        message: {
          id: msg.id,
          senderId: msg.senderId,
          senderName: msg.sender.name,
          content: msg.content,
          type: msg.type,
          metadata: question,
          createdAt: msg.createdAt
        }
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get dynamic conversation starter recommendation
   */
  public static async getConversationStarter(req: Request, res: Response) {
    try {
      const currentUserId = (req as any).userId;
      const { otherUserId } = req.params;

      const userA = await prisma.user.findUnique({ where: { id: currentUserId } });
      const userB = await prisma.user.findUnique({ where: { id: otherUserId } });

      if (!userA || !userB) return res.status(404).json({ error: "User not found" });

      const interestsA: string[] = JSON.parse(userA.interests || "[]");
      const interestsB: string[] = JSON.parse(userB.interests || "[]");

      const shared = interestsA.filter(i => interestsB.includes(i));
      const starterPrompt = GameService.getConversationStarter(shared);

      return res.json({ starterPrompt, sharedInterests: shared });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
