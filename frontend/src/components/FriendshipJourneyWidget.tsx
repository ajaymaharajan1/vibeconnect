'use client';

import React, { useState } from 'react';
import { Flame, CheckCircle2, ChevronRight, Trophy, HeartHandshake } from 'lucide-react';

export interface JourneyMilestone {
  stage: string;
  label: string;
  description: string;
  icon: string;
  strengthPercentage: number;
  completed: boolean;
}

interface FriendshipJourneyWidgetProps {
  friendName: string;
  strengthScore?: number;
  currentStageLabel?: string;
  nextMilestonePrompt?: string;
  milestones?: JourneyMilestone[];
}

export function FriendshipJourneyWidget({
  friendName = 'Meera',
  strengthScore = 78,
  currentStageLabel = 'Met in Real Life ☕',
  nextMilestonePrompt = 'Meet up again for a community event to reach 88% Friendship Strength!',
  milestones = [
    { stage: 'CONNECTED', label: 'Connected', description: 'Mutual request accepted', icon: '🌱', strengthPercentage: 15, completed: true },
    { stage: 'CHATTED', label: 'Chatted', description: 'Exchanged messages & played icebreaker game', icon: '💬', strengthPercentage: 35, completed: true },
    { stage: 'VOICE_INTRO', label: 'Voice Intro', description: '1-on-1 voice conversation', icon: '📞', strengthPercentage: 50, completed: true },
    { stage: 'MET_ONCE', label: 'Met Once', description: 'Attended 1st coffee meetup at Blue Tokai', icon: '☕', strengthPercentage: 70, completed: true },
    { stage: 'MET_AGAIN', label: 'Met Again', description: 'Attended 2nd community activity', icon: '🔥', strengthPercentage: 88, completed: false },
    { stage: 'FRIENDSHIP_ESTABLISHED', label: 'Friendship Built', description: 'Confirmed offline circle', icon: '🎉', strengthPercentage: 98, completed: false }
  ]
}: FriendshipJourneyWidgetProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 shadow-lg border border-indigo-500/30 mb-3">
      {/* Top Summary Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-extrabold text-sm shadow-md">
            <Flame className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Friendship Journey
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                {strengthScore}% Strength
              </span>
            </div>
            <p className="text-xs text-slate-200 font-semibold">
              Stage: {currentStageLabel} with {friendName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-bold text-indigo-300 hover:text-white underline px-2 py-1 rounded-lg hover:bg-white/10 transition"
        >
          {expanded ? 'Hide Milestones' : 'View Milestones'}
        </button>
      </div>

      {/* Strength Progress Bar */}
      <div className="mt-2.5 bg-slate-800/80 rounded-full h-2 w-full overflow-hidden p-0.5 border border-slate-700">
        <div
          className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${strengthScore}%` }}
        ></div>
      </div>

      {/* Expanded Trajectory Timeline */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
          <p className="text-[11px] text-indigo-200 font-medium bg-indigo-900/50 p-2 rounded-xl border border-indigo-700/40">
            💡 <strong>Next Milestone:</strong> {nextMilestonePrompt}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition ${
                  m.completed
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-100'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{m.icon}</span>
                  {m.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">{m.strengthPercentage}%</span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-[11px] leading-tight text-white">{m.label}</div>
                  <div className="text-[9px] text-slate-300 line-clamp-1">{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
