export interface DiscoveredUser {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  photoUrl: string;
  interests: string[];
  vibeTraits: string[];
  meetupReliabilityScore: number;
  isFree: boolean;
  freeStartTime?: string;
  freeEndTime?: string;
  freeLookingFor?: string[];
  freeGroupSize?: string;
  vibeMatchScore: number;
  vibeMatchReasons: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  type: "TEXT" | "PHOTO" | "LOCATION" | "MEETUP_INVITE" | "GAME_CARD";
  metadata?: any;
  createdAt: string;
}

export interface MeetupItem {
  id: string;
  title: string;
  description: string;
  venueName: string;
  time: string;
  maxCapacity: number;
  minCapacity: number;
  status: string;
  creatorName: string;
  creatorPhoto: string;
  creatorReliability: number;
  communityName?: string | null;
  rsvpsCount: number;
  attendees: {
    userId: string;
    name: string;
    photoUrl: string;
    status: string;
  }[];
}

export interface CommunityItem {
  id: string;
  name: string;
  description: string;
  category: string;
  coverUrl: string;
  city: string;
  ownerName: string;
  membersCount: number;
  eventsCount: number;
}

export interface SocialPost {
  id: string;
  content: string;
  photoUrl?: string;
  locationName?: string;
  likesCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    photoUrl: string;
    city: string;
  };
  communityName?: string | null;
}
