'use client';

import React from 'react';
import { Sparkles, Users, Calendar, Handshake, MapPin, TrendingUp, Flame, Ticket, Crown } from 'lucide-react';
import { VibeCard } from '../VibeCard';
import { MeetupCard } from '../MeetupCard';
import { CommunityCard } from '../CommunityCard';
import { SocialFeedCard } from '../SocialFeedCard';

interface HomeModuleProps {
  currentUser: any;
  currentCity: string;
  myFreeStatus: any;
  people: any[];
  meetups: any[];
  communities: any[];
  posts: any[];
  onOpenQuestionnaire: () => void;
  onOpenAIPlanner: () => void;
  onOpenFreeModal: () => void;
  onSelectPerson: (id: string) => void;
  onSelectEventTicket: (event: any) => void;
  onNavigateModule: (module: 'home' | 'discover' | 'chats' | 'meetups' | 'profile') => void;
}

export const HomeModule: React.FC<HomeModuleProps> = ({
  currentUser,
  currentCity,
  myFreeStatus,
  people,
  meetups,
  communities,
  posts,
  onOpenQuestionnaire,
  onOpenAIPlanner,
  onOpenFreeModal,
  onSelectPerson,
  onSelectEventTicket,
  onNavigateModule,
}) => {
  return (
    <div className="space-y-8 pb-20">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-violet-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Personalized Dashboard
            </span>
            <button
              onClick={onOpenQuestionnaire}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>✨ Set Your Vibe</span>
            </button>
            <button
              onClick={onOpenAIPlanner}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>🤖 AI Meetup Planner</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Good evening, {currentUser?.name || 'Friend'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Here is your daily social feed, nearby vibe matches in <strong>{currentCity}</strong>, and active meetup opportunities.
          </p>

          {myFreeStatus?.isFree && (
            <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>🟢 Available for Meetups ({myFreeStatus.freeStartTime} - {myFreeStatus.freeEndTime})</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Nearby People Match Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" /> Nearby Vibe Matches ({people.length})
            </h2>
            <p className="text-xs text-slate-400">People matching your energy style & interests in {currentCity}</p>
          </div>
          <button
            onClick={() => onNavigateModule('discover')}
            className="text-xs text-violet-400 hover:text-violet-300 font-bold"
          >
            View All in Discover →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.slice(0, 3).map((person) => (
            <div key={person.id} className="relative group">
              <VibeCard
                user={person}
                onConnect={() => onSelectPerson(person.id)}
                isConnected={false}
              />
              <button
                onClick={() => onSelectPerson(person.id)}
                className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg transition"
              >
                View Vibe Score
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Upcoming Meetups Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Handshake className="w-5 h-5 text-amber-400" /> Active Meetups Near You
            </h2>
            <p className="text-xs text-slate-400">Protected by 🛟 Meetup Guarantee. Attendance threshold monitoring.</p>
          </div>
          <button
            onClick={() => onNavigateModule('meetups')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold"
          >
            Open Meetups Hub →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetups.slice(0, 2).map((meetup) => (
            <MeetupCard
              key={meetup.id}
              meetup={meetup}
              onRSVP={() => alert(`RSVP requested for ${meetup.title}`)}
              onTriggerRescue={() => alert('Meetup Rescue Guarantee Options activated!')}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Trending Community Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-400" /> Trending Social Posts
            </h2>
            <p className="text-xs text-slate-400">Stories & photos shared by members in {currentCity}</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {posts.map((post) => (
            <SocialFeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
