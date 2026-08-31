import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PushNotificationPayload {
  userId: string;
  title: string;
  body: string;
  type: 'MESSAGE' | 'CONNECTION_REQUEST' | 'COMMUNITY_INVITE' | 'MEETUP_REMINDER' | 'EVENT_REMINDER';
  metadata?: any;
}

export class NotificationQueueService {
  private static queue: PushNotificationPayload[] = [];
  private static isProcessing = false;

  /**
   * Enqueue a push notification
   */
  public static sendNotification(payload: PushNotificationPayload) {
    this.queue.push(payload);
    this.processQueue();
  }

  private static async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;

      try {
        // 1. Store in-app notification in DB
        await prisma.notification.create({
          data: {
            userId: item.userId,
            title: item.title,
            body: item.body,
            type: item.type,
            metadata: item.metadata ? JSON.stringify(item.metadata) : null,
          },
        });

        // 2. Mock Firebase Cloud Messaging (FCM) Push Gateway
        console.log(`[FCM Push Gateway] Dispatched to user ${item.userId}: "${item.title}" - ${item.body}`);
      } catch (err) {
        console.error('[Notification Service Error]:', err);
      }
    }

    this.isProcessing = false;
  }
}
