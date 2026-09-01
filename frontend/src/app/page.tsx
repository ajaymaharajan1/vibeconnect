'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { Sidebar } from '../components/navigation/Sidebar';
import { HomeModule } from '../components/home/HomeModule';
import { DiscoverModule } from '../components/discover/DiscoverModule';
import { MeetupsModule } from '../components/meetups/MeetupsModule';
import { EventsModule } from '../components/events/EventsModule';
import { ProfileModule } from '../components/profile/ProfileModule';
import { SettingsModal } from '../components/settings/SettingsModal';

import { AuthModal } from '../components/AuthModal';
import { VibeQuestionnaireModal } from '../components/VibeQuestionnaireModal';
import { AIMeetupPlannerModal } from '../components/AIMeetupPlannerModal';
import { MeetupRescueModal } from '../components/MeetupRescueModal';
import { ProfileEditModal } from '../components/ProfileEditModal';
import { PublicProfileModal } from '../components/PublicProfileModal';
import { EventTicketModal } from '../components/EventTicketModal';
import { PremiumSubscriptionModal } from '../components/PremiumSubscriptionModal';
import { AdminDashboardModal } from '../components/AdminDashboardModal';
import { CitySelectorModal } from '../components/CitySelectorModal';
import { VerificationModal } from '../components/VerificationModal';
import { ChatWindow } from '../components/ChatWindow';

import { ChatMessage, MeetupItem, CommunityItem, SocialPost } from '../types';
import { Menu, MapPin, ShieldCheck, Crown, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '../config/api.config';

export default function Home() {
  const [activeModule, setActiveModule] = useState<'home' | 'discover' | 'chats' | 'meetups' | 'profile'>('home');
  const [currentCity, setCurrentCity] = useState<string>('Chennai');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);
  const [isAIPlannerModalOpen, setIsAIPlannerModalOpen] = useState(false);
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedPublicUserId, setSelectedPublicUserId] = useState<string | null>(null);
  const [selectedEventTicket, setSelectedEventTicket] = useState<any | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibeconnect_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      id: 'ajay-1',
      name: 'Ajay',
      email: 'ajay@vibeconnect.app',
      age: 25,
      city: 'Chennai',
      bio: 'Tech builder & outdoor enthusiast!',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      languages: ['English', 'Tamil'],
      interests: ['Tech', 'Photography', 'Coffee'],
      activities: ['Street Photowalk', 'Running'],
      socialIntentions: 'Friendship & Activity Partners',
      personalityType: 'Ambivert',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      isPremium: true,
    };
  });

  const [myFreeStatus] = useState({
    isFree: true,
    freeStartTime: '6:00 PM',
    freeEndTime: '9:00 PM',
  });

  // Display toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Clean Logout Handler
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vibeconnect_token');
      localStorage.removeItem('vibeconnect_user');
    }
    setCurrentUser(null);
    setIsSidebarOpen(false);
    setIsAuthModalOpen(true);
    showToast('Logged out successfully');
  };

  // People List
  const [people] = useState<any[]>([
    {
      id: 'meera-1',
      name: 'Meera',
      age: 23,
      city: 'Chennai',
      neighborhood: 'Near Anna Nagar',
      bio: 'UI Designer new to Chennai! Looking for photography buddies, gym partners, and cozy coffee spots.',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      interests: ['Photography', 'Fitness', 'Coffee', 'Travel'],
      activities: ['Cafe Hopping', 'Running'],
      languages: ['English', 'Tamil'],
      personalityType: 'Ambivert',
      meetupReliabilityScore: 96,
      isFree: true,
      freeStartTime: '5:30 PM',
      freeEndTime: '8:30 PM',
      vibeMatchScore: 94,
      vibeMatchReasons: ['Shared interests in Photography & Coffee', 'Very close distance (~3.5 km away)']
    },
    {
      id: 'vikram-2',
      name: 'Vikram',
      age: 26,
      city: 'Bengaluru',
      neighborhood: 'Near Indiranagar',
      bio: 'Tech enthusiast who loves badminton, board game nights, and weekend road trips.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      interests: ['Gaming', 'Sports', 'Technology', 'Coffee'],
      activities: ['Board Games', 'Badminton'],
      languages: ['English', 'Hindi'],
      personalityType: 'Extrovert',
      meetupReliabilityScore: 91,
      isFree: false,
      vibeMatchScore: 88,
      vibeMatchReasons: ['Both interested in Tech & Coffee', 'High energy social vibe match']
    }
  ]);

  // Events List
  const [events] = useState<any[]>([
    {
      id: 'event-1',
      title: '📸 Chennai Sunset Photowalk & Exhibition',
      description: 'Explore historical sites around Mylapore and Marina Beach with local photography enthusiasts!',
      venueName: 'Kapaleeshwarar Temple Square, Mylapore',
      date: 'This Saturday, 5:00 PM',
      price: 0,
      isPaid: false,
      maxCapacity: 30,
      category: 'Photography',
    },
    {
      id: 'event-2',
      title: '☕ Tech & Startup Founders Coffee Social',
      description: 'Casual networking event for product developers, founders, and creators in Chennai.',
      venueName: 'Blue Tokai Coffee, Nungambakkam',
      date: 'Next Sunday, 11:00 AM',
      price: 299,
      isPaid: true,
      maxCapacity: 15,
      category: 'Tech & Networking',
    }
  ]);

  // Messages List
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: 'meera-1',
      senderName: 'Meera',
      senderPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      content: 'Hey Ajay! 👋 Saw on VibeConnect that we both love street photography and coffee!',
      type: 'TEXT',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  // Meetups List
  const [meetups] = useState<MeetupItem[]>([
    {
      id: 'meetup-1',
      title: '☕ Saturday Sunset Coffee & Chat',
      description: 'Casual weekend coffee meetup to make new friends and chat about photography.',
      venueName: 'Blue Tokai Coffee, Nungambakkam',
      time: '6:30 PM Today',
      maxCapacity: 4,
      minCapacity: 2,
      status: 'CONFIRMED',
      creatorName: 'Ajay',
      creatorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      creatorReliability: 94,
      rsvpsCount: 2,
      attendees: [
        { userId: 'me', name: 'Ajay', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', status: 'CONFIRMED' },
        { userId: 'meera-1', name: 'Meera', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', status: 'CONFIRMED' }
      ]
    }
  ]);

  // Communities List
  const [communities] = useState<CommunityItem[]>([
    {
      id: 'c1',
      name: 'Chennai Photography Club 📸',
      description: 'A vibrant community for photographers to share work, plan photowalks, and critique shots.',
      category: 'Photography',
      coverUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
      city: 'Chennai',
      ownerName: 'Meera',
      membersCount: 142,
      eventsCount: 8
    }
  ]);

  // Posts List
  const [posts] = useState<SocialPost[]>([
    {
      id: 'p1',
      content: 'First photowalk with the Chennai Photography community! Here is a shot from Marina Beach golden hour. 📸🌊',
      photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      locationName: 'Marina Beach, Chennai',
      likesCount: 24,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      author: {
        id: 'meera-1',
        name: 'Meera',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        city: 'Chennai'
      },
      communityName: 'Chennai Photography Club 📸'
    }
  ]);

  const handleSendMessage = (text: string, type: string = 'TEXT', metadata: any = null) => {
    const newMsg: ChatMessage = {
      id: 'm_' + Date.now(),
      senderId: currentUser ? currentUser.name.toLowerCase() : 'guest',
      senderName: currentUser ? currentUser.name : 'Guest',
      content: text,
      type: type as any,
      metadata,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleLaunchGame = (gameType: string) => {
    let question = {
      gameType,
      question: "Would you rather travel the world for a year 🌎 or receive $50,000 to invest 💰?",
      options: ["Travel the World 🌎", "Invest $50,000 💰"]
    };
    handleSendMessage(`🎮 Launched game: ${gameType}`, 'GAME_CARD', question);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Top Application Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Top Left Hamburger (☰) Sidebar Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveModule('home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-md">
                V
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                VibeConnect
              </span>
            </div>
          </div>

          {/* Top Right Quick Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-violet-400" />
              <span>📍 {currentCity}</span>
            </button>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-full transition cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-md cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Module Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeModule === 'home' && (
          <HomeModule
            currentUser={currentUser}
            currentCity={currentCity}
            myFreeStatus={myFreeStatus}
            people={people}
            meetups={meetups}
            communities={communities}
            posts={posts}
            onOpenQuestionnaire={() => setIsQuestionnaireModalOpen(true)}
            onOpenAIPlanner={() => setIsAIPlannerModalOpen(true)}
            onOpenFreeModal={() => showToast('Opening Free Status modal')}
            onSelectPerson={(id) => setSelectedPublicUserId(id)}
            onSelectEventTicket={(evt) => setSelectedEventTicket(evt)}
            onNavigateModule={(mod) => setActiveModule(mod)}
          />
        )}

        {activeModule === 'discover' && (
          <DiscoverModule
            currentCity={currentCity}
            people={people}
            communities={communities}
            events={events}
            onSelectPerson={(id) => setSelectedPublicUserId(id)}
            onSelectEventTicket={(evt) => setSelectedEventTicket(evt)}
          />
        )}

        {activeModule === 'chats' && (
          <div className="max-w-4xl mx-auto pb-20">
            <ChatWindow
              roomName="Meera"
              roomPhoto="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
              messages={messages}
              onSendMessage={handleSendMessage}
              onLaunchGame={handleLaunchGame}
              onOpenAIPlanner={() => setIsAIPlannerModalOpen(true)}
              starterPrompt="You both love Photography 📸! Try asking: 'What's the best photo you've ever taken?'"
            />
          </div>
        )}

        {activeModule === 'meetups' && (
          <MeetupsModule
            meetups={meetups}
            onOpenAIPlanner={() => setIsAIPlannerModalOpen(true)}
            onOpenRescueModal={() => setShowRescueModal(true)}
            onOpenChat={() => setActiveModule('chats')}
          />
        )}

        {activeModule === 'events' && (
          <EventsModule
            events={events}
            onSelectEventTicket={(evt) => setSelectedEventTicket(evt)}
          />
        )}

        {activeModule === 'profile' && (
          <ProfileModule
            currentUser={currentUser}
            posts={posts}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenVerification={() => setIsVerificationModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        unreadChatCount={1}
      />

      {/* Left Slide-Out Sidebar Overlay (☰) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        onLogout={handleLogout}
        onNavigateModule={(mod) => setActiveModule(mod)}
      />

      {/* Modals & Dialogs */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onSaveSuccess={(updated) => {
          setCurrentUser(updated);
          showToast('Settings saved successfully!');
        }}
      />

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={currentCity}
        onCitySelected={(city) => {
          setCurrentCity(city.name);
          showToast(`Discovery city changed to ${city.name}`);
        }}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSuccess={() => {
          setCurrentUser({ ...currentUser, isVerified: true, verificationStatus: 'VERIFIED' });
          showToast('Profile Verified! ✓ Verified badge earned');
        }}
      />

      <ProfileEditModal
        user={currentUser}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSaveSuccess={(updated) => {
          setCurrentUser(updated);
          showToast('Profile updated!');
        }}
      />

      <PublicProfileModal
        userId={selectedPublicUserId}
        isOpen={!!selectedPublicUserId}
        onClose={() => setSelectedPublicUserId(null)}
        onOpenChat={() => {
          setSelectedPublicUserId(null);
          setActiveModule('chats');
        }}
      />

      <EventTicketModal
        event={selectedEventTicket}
        isOpen={!!selectedEventTicket}
        onClose={() => setSelectedEventTicket(null)}
      />

      <PremiumSubscriptionModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onSuccess={() => {
          setCurrentUser({ ...currentUser, isPremium: true });
          showToast('VibeConnect Premium Activated!');
        }}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(data, token) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('vibeconnect_token', token);
            localStorage.setItem('vibeconnect_user', JSON.stringify(data));
          }
          setCurrentUser(data);
          showToast(`Welcome back, ${data.name}!`);
        }}
      />

      <AIMeetupPlannerModal
        isOpen={isAIPlannerModalOpen}
        onClose={() => setIsAIPlannerModalOpen(false)}
        onSelectSpot={(spot) => {
          handleSendMessage(`🤖 AI Meetup Suggestion: ${spot.spotName}`);
          setActiveModule('chats');
          showToast('Meetup spot added to chat!');
        }}
      />

      <MeetupRescueModal
        isOpen={showRescueModal}
        onClose={() => setShowRescueModal(false)}
        meetupTitle="Saturday Sunset Coffee & Chat"
        confirmedCount={1}
        onTransferRSVP={() => {
          setShowRescueModal(false);
          showToast('Meetup RSVP Transferred!');
        }}
      />

      <VibeQuestionnaireModal
        isOpen={isQuestionnaireModalOpen}
        onClose={() => setIsQuestionnaireModalOpen(false)}
        onSubmitted={() => showToast('✨ Vibe Vector Saved!')}
      />
    </div>
  );
}
