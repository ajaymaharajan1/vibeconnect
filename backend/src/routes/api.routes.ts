import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";
import { ConnectionController as LegacyConnectionController } from "../controllers/connection.controller";
import { ChatController } from "../controllers/chat.controller";
import { MeetupController } from "../controllers/meetup.controller";
import { authMiddleware } from "../middleware/auth.middleware";

import * as ProfileController from "../controllers/profile.controller";
import * as DiscoveryController from "../controllers/discovery.controller";
import * as ConnectionStateController from "../controllers/connection.controller";
import { FeedController } from "../controllers/feed.controller";
import * as EventController from "../controllers/event.controller";
import * as PremiumController from "../controllers/premium.controller";
import * as AdminController from "../controllers/admin.controller";
import * as CityController from "../controllers/city.controller";
import * as PlacesController from "../controllers/places.controller";
import * as VerificationController from "../controllers/verification.controller";

const router = Router();

// --- Auth Routes & 2FA OTP (with 18+ DOB Check) ---
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/me", authMiddleware, AuthController.getMe);
router.post("/auth/send-otp", AuthController.sendOTP);
router.post("/auth/verify-otp", AuthController.verifyOTP);

// --- Multi-City System APIs ---
router.get("/cities", CityController.getCities);
router.patch("/users/city", authMiddleware, CityController.updateCityPreferences);

// --- Google Maps Places Discovery APIs (10 Social Categories) ---
router.get("/places/nearby", PlacesController.getNearbyPlaces);
router.get("/places/:id", PlacesController.getPlaceDetails);

// --- Face & Liveness Verification Pipeline ---
router.post("/verification/start", authMiddleware, VerificationController.startVerificationSession);
router.get("/verification/status", authMiddleware, VerificationController.getVerificationStatus);
router.post("/verification/webhook", VerificationController.handleVerificationWebhook);

// --- Profile Module APIs ---
router.get("/profile/me", authMiddleware, ProfileController.getMyProfile);
router.put("/profile/update", authMiddleware, ProfileController.updateProfile);
router.post("/profile/photo", authMiddleware, ProfileController.uploadProfilePhoto);
router.get("/profile/user/:userId", authMiddleware, ProfileController.getPublicProfile);
router.put("/profile/privacy", authMiddleware, ProfileController.updatePrivacySettings);

// --- Interests & Vibe Discovery System ---
router.get("/discovery/people", authMiddleware, DiscoveryController.discoverPeople);
router.get("/discovery/communities", DiscoveryController.discoverCommunities);
router.get("/discovery/events", DiscoveryController.discoverEvents);
router.get("/discovery/meetups", DiscoveryController.discoverMeetups);

router.get("/users/discover", UserController.discoverPeople);
router.post("/users/im-free", authMiddleware, UserController.toggleFreeMode);
router.post("/users/vibe-questionnaire", authMiddleware, UserController.submitVibeQuestionnaire);

// --- Connection Module & State Machine ---
router.post("/connections/send", authMiddleware, ConnectionStateController.sendRequest);
router.post("/connections/accept", authMiddleware, ConnectionStateController.acceptRequest);
router.post("/connections/reject", authMiddleware, ConnectionStateController.rejectRequest);
router.post("/connections/cancel", authMiddleware, ConnectionStateController.cancelRequest);
router.post("/connections/block", authMiddleware, ConnectionStateController.blockUser);
router.post("/connections/unblock", authMiddleware, ConnectionStateController.unblockUser);
router.get("/connections/list", authMiddleware, ConnectionStateController.getMyConnections);

// Legacy connection routes fallback
router.post("/connections/request", authMiddleware, LegacyConnectionController.sendConnectRequest);
router.post("/connections/respond", authMiddleware, LegacyConnectionController.respondToRequest);
router.get("/connections/my", authMiddleware, LegacyConnectionController.getMyConnections);
router.get("/connections/journey/:friendId", LegacyConnectionController.getFriendshipJourney);

// --- Chat & Realtime Games ---
router.get("/chat/rooms", authMiddleware, ChatController.getRooms);
router.get("/chat/rooms/:roomId/messages", authMiddleware, ChatController.getMessages);
router.post("/chat/send", authMiddleware, ChatController.sendMessage);
router.post("/chat/game/launch", authMiddleware, ChatController.launchGame);
router.get("/chat/starter/:otherUserId", authMiddleware, ChatController.getConversationStarter);

// --- Social Feed ---
router.get("/feed", FeedController.getPosts);
router.post("/feed/create", authMiddleware, FeedController.createPost);
router.post("/feed/like", authMiddleware, FeedController.toggleLike);
router.post("/feed/comment", authMiddleware, FeedController.commentPost);
router.post("/feed/save", authMiddleware, FeedController.toggleSavePost);
router.delete("/feed/post/:postId", authMiddleware, FeedController.deletePost);

// --- Meetups & AI Planner ---
router.get("/meetups", MeetupController.getMeetups);
router.post("/meetups/create", authMiddleware, MeetupController.createMeetup);
router.post("/meetups/rsvp", authMiddleware, MeetupController.rsvpMeetup);
router.post("/meetups/ai-planner", MeetupController.planAIMeetup);
router.get("/meetups/rescue", authMiddleware, MeetupController.getRescueRecommendations);

// --- Events & QR Ticket Passes ---
router.get("/events", MeetupController.getEvents);
router.post("/events/create", authMiddleware, EventController.createEvent);
router.post("/events/register", authMiddleware, EventController.registerForEvent);
router.post("/events/verify-qr", authMiddleware, EventController.verifyQRTicket);
router.get("/events/organizer/dashboard", authMiddleware, EventController.getOrganizerDashboard);

// --- Premium & Business Ads (Razorpay) ---
router.post("/premium/subscribe", authMiddleware, PremiumController.activateSubscription);
router.post("/premium/create-ad", authMiddleware, PremiumController.createBusinessAd);
router.get("/premium/ads", PremiumController.getActiveAds);

// --- Admin Panel Dashboard APIs ---
router.get("/admin/analytics", AdminController.getAdminAnalytics);
router.get("/admin/users", AdminController.searchAdminUsers);
router.post("/admin/ban", AdminController.toggleBanUser);
router.get("/admin/reports", AdminController.getAdminReports);
router.post("/admin/reports/resolve", AdminController.resolveReport);

export default router;
