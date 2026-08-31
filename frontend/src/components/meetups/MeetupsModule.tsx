'use client';

import React, { useState } from 'react';
import { Handshake, Plus, Sparkles, MapPin, CheckCircle2, Clock, MessageSquare, Volume2, ShieldCheck, Users } from 'lucide-react';
import { MeetupCard } from '../MeetupCard';

interface MeetupsModuleProps {
  meetups: any[];
  onOpenAIPlanner: () => void;
  onOpenRescueModal: () => void;
  onOpenChat: (roomId?: string) => void;
}

export const MeetupsModule: React.FC<MeetupsModuleProps> = ({
  meetups,
  onOpenAIPlanner,
  onOpenRescueModal,
  onOpenChat,
}) => {
  const [tab, setTab] = useState<'upcoming' | 'my' | 'past'>('upcoming');
  const [selectedMeetup, setSelectedMeetup] = useState<any | null>(null);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Handshake className="w-6 h-6 text-amber-400" /> Dedicated Meetups Hub
          </h1>
          <p className="text-xs text-slate-400">Host informal hangouts, RSVP, check-in & chat with participants</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIPlanner}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-white" /> 🤖 AI Planner
          </button>
          <button
            onClick={() => alert('Host Meetup: Form wizard with Google Places selection!')}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Host Meetup
          </button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'upcoming' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Upcoming Meetups
        </button>
        <button
          onClick={() => setTab('my')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'my' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          My RSVPs & Hosted
        </button>
        <button
          onClick={() => setTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'past' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Past Meetups
        </button>
      </div>

      {/* Meetups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetups.map((meetup) => (
          <div key={meetup.id} className="relative group">
            <MeetupCard
              meetup={meetup}
              onRSVP={(id, status) => alert(`RSVP status set to ${status} for ${meetup.title}`)}
              onTriggerRescue={onOpenRescueModal}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onOpenChat('meetup_room_1')}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <MessageSquare className="w-4 h-4 text-violet-400" /> Meetup Group Chat
              </button>
              <button
                onClick={() => alert('🎙️ Joining Meetup Live Voice Room...')}
                className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" /> Voice Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
