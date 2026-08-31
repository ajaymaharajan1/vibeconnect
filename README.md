# VibeConnect Platform MVP

> **Find Your People. Build Your Circle. Meet in Real Life.**

VibeConnect is a real-world social discovery platform that helps people discover compatible people, communities, activities, and events around them and transition online discovery into genuine offline friendships.

---

## 🌟 Core Features Built in MVP

1. **Vibe & Interest Matching Algorithm (`vibeMatcher.service.ts`)**:
   - Calculates % match score based on shared interests, hobbies, vibe traits (e.g., Chill, Fun, Social), social energy, group size preference, and location proximity.
2. **"I'm Free" Mode (`ImFreeModal.tsx`)**:
   - Spontaneous availability announcements (time window, activities, preferred group size).
3. **Connection Consent Layer (`connection.controller.ts`)**:
   - Mutual connect requests (`PENDING`, `ACCEPTED`, `DECLINED`, `BLOCKED`).
4. **Real-time Chat & In-Chat Games (`chat.controller.ts`, `ChatWindow.tsx`)**:
   - WebSockets / Socket.IO real-time messaging.
   - Built-in interactive icebreaker games: *"Would You Rather"*, *"This or That"*, *"Two Truths & a Lie"*.
   - Dynamic interest-based conversation starters.
5. **Meetups & RSVP Reliability Engine (`meetup.controller.ts`, `reliability.service.ts`)**:
   - RSVP lifecycle (`INTERESTED` -> `GOING` -> `CONFIRMED` -> `CHECKED_IN`).
   - ⭐ Meetup Reliability Score calculation based on check-ins and cancellations.
6. **Meetup Rescue (`rescue.service.ts`)**:
   - Automatic fallback social recommendations if attendance drops below minimum capacity.
7. **Communities & Social Feed (`feed.controller.ts`, `SocialFeedCard.tsx`)**:
   - Interest-based groups, event listings, photowalk memories, likes, and comments.

---

## 📁 Directory Structure

```text
vibeconnect/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma Database Schema (SQLite / PostgreSQL)
│   │   └── seed.ts             # Realistic database seeder with Chennai sample profiles
│   ├── src/
│   │   ├── config/             # Config files
│   │   ├── controllers/        # Auth, User, Connection, Chat, Meetup, Feed controllers
│   │   ├── middleware/         # Auth & validation middleware
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Vibe Matching, Reliability Score, Rescue, Games services
│   │   ├── sockets/            # Socket.IO handlers for Chat & Games
│   │   └── index.ts            # Main backend server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router (layout, globals, home page)
│   │   ├── components/         # Navbar, VibeCard, ImFreeModal, ChatWindow, MeetupCard, etc.
│   │   └── types/              # TypeScript definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

---

## 🚀 How to Run the Project

### 1. Backend Server Setup

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev
```
The API server will run at `http://localhost:5000`.

### 2. Frontend Web Setup

```bash
cd frontend
npm install
npm run dev
```
The Web App will run at `http://localhost:3000`.

---

## 🛡️ API Endpoints Summary

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/discover` - Discover nearby people with calculated Vibe Match %
- `POST /api/users/im-free` - Update "I'm Free" availability mode
- `POST /api/connections/request` - Send mutual connection request
- `GET /api/chat/rooms` - Fetch chat rooms & active connections
- `POST /api/chat/game/launch` - Launch in-chat icebreaker game
- `GET /api/meetups` - Fetch meetups & RSVP states
- `GET /api/meetups/rescue` - Trigger Meetup Rescue fallback options
- `GET /api/feed` - Fetch social posts & meetup memories
