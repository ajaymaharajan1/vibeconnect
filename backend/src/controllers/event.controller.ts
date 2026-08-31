import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// POST /api/events/create - Create Free or Paid Event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const creatorId = (req as any).user?.id || 'demo-user-id';
    const { title, description, category, venueName, date, price, maxCapacity, isPaid, communityId } = req.body;

    if (!title || !venueName || !date) {
      res.status(400).json({ error: 'Title, venueName, and date are required' });
      return;
    }

    const event = await prisma.event.create({
      data: {
        creatorId,
        title,
        description: description || '',
        category: category || 'Social',
        venueName,
        date,
        price: isPaid ? Number(price || 0) : 0,
        maxCapacity: Number(maxCapacity || 20),
        isPaid: Boolean(isPaid),
        communityId,
      },
    });

    res.json({
      success: true,
      message: 'Event created successfully!',
      event,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
};

// POST /api/events/register - Register & Generate QR Ticket
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { eventId, paidAmount } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Cryptographic QR code payload hash
    const qrPayload = JSON.stringify({
      ticketId: crypto.randomUUID(),
      eventId: event.id,
      userId,
      eventTitle: event.title,
      date: event.date,
      signature: crypto.createHash('sha256').update(`${eventId}:${userId}:VIBECONNECT_PASS`).digest('hex').substring(0, 16),
    });

    const ticket = await prisma.eventTicket.create({
      data: {
        eventId,
        userId,
        qrCode: qrPayload,
        paidAmount: Number(paidAmount || event.price),
        status: 'ACTIVE',
      },
      include: {
        event: true,
      },
    });

    res.json({
      success: true,
      message: 'Event registered! Your QR Pass has been issued.',
      ticket,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to register for event' });
  }
};

// POST /api/events/verify-qr - Organizer QR Scanner Verification
export const verifyQRTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrCodeString } = req.body;
    if (!qrCodeString) {
      res.status(400).json({ error: 'qrCodeString payload is required' });
      return;
    }

    const payload = typeof qrCodeString === 'string' ? JSON.parse(qrCodeString) : qrCodeString;

    const ticket = await prisma.eventTicket.findFirst({
      where: {
        eventId: payload.eventId,
        userId: payload.userId,
      },
      include: {
        user: { select: { name: true, photoUrl: true, email: true } },
        event: { select: { title: true, venueName: true, date: true } },
      },
    });

    if (!ticket) {
      res.status(404).json({ error: 'Invalid or forged event QR pass' });
      return;
    }

    if (ticket.status === 'CHECKED_IN') {
      res.status(400).json({ error: 'Ticket has ALREADY been scanned & checked in!', ticket });
      return;
    }

    const updated = await prisma.eventTicket.update({
      where: { id: ticket.id },
      data: { status: 'CHECKED_IN', checkedInAt: new Date() },
    });

    res.json({
      success: true,
      message: '✅ Ticket Verified! Participant Checked-In.',
      ticket: {
        ...updated,
        user: ticket.user,
        event: ticket.event,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to verify QR ticket' });
  }
};

// GET /api/events/organizer/dashboard - Organizer Participant Management
export const getOrganizerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const creatorId = (req as any).user?.id || 'demo-user-id';

    const events = await prisma.event.findMany({
      where: { creatorId },
      include: {
        tickets: {
          include: {
            user: { select: { id: true, name: true, email: true, photoUrl: true } },
          },
        },
      },
    });

    const summary = events.map((e) => ({
      eventId: e.id,
      title: e.title,
      date: e.date,
      totalTicketsSold: e.tickets.length,
      checkedInCount: e.tickets.filter((t) => t.status === 'CHECKED_IN').length,
      revenueGenerated: e.tickets.reduce((acc, t) => acc + t.paidAmount, 0),
      participants: e.tickets,
    }));

    res.json({
      success: true,
      eventsCount: events.length,
      dashboard: summary,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch organizer dashboard' });
  }
};
