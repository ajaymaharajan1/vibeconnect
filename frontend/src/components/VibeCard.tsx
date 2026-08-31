'use client';

import React from 'react';
import { DiscoveredUser } from '../types';
import { Sparkles, MapPin, Star, UserPlus, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VibeCardProps {
  user: DiscoveredUser & { isVerified?: boolean; vibeAnswers?: any };
  onConnect: (userId: string) => void;
  isConnected?: boolean;
}

export function VibeCard({ user, onConnect, isConnected }: VibeCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Profile Image & Badges Overlay */}
        <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
          <img
            src={user.photoUrl}
            alt={user.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Vibe Match Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>{user.vibeMatchScore}% Vibe Match</span>
          </div>

          {/* 2FA Verified Badge */}
          {user.isVerified && (
            <div className="absolute top-3 right-3 bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>✓ 2FA Verified</span>
            </div>
          )}

          {/* "I'm Free" Mode Pill */}
          {user.isFree && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 text-emerald-200 border border-emerald-500/40 backdrop-blur-md text-xs font-medium px-3 py-1.5 rounded-xl flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>🟢 Free {user.freeStartTime} - {user.freeEndTime}</span>
              </span>
              <span className="text-[11px] text-emerald-300">
                {user.freeLookingFor?.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Name, Age, Location */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">
                {user.name}, <span className="font-normal text-slate-600">{user.age}</span>
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{user.city}</span>
            </span>
          </div>

          {/* Bio */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            "{user.bio}"
          </p>

          {/* Vibe Questionnaire Results Pill */}
          {user.vibeAnswers && user.vibeAnswers.socialEnergy && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3 text-[11px] font-semibold text-slate-700 space-y-1">
              <div className="flex justify-between items-center text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
                <span>✨ Calculated Vibe Profile</span>
                <span className="text-amber-600 font-extrabold">⭐ {user.meetupReliabilityScore}% Score</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[11px]">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">
                  {user.vibeAnswers.socialEnergy}
                </span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">
                  {user.vibeAnswers.meetupStyle}
                </span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">
                  {user.vibeAnswers.conversationStyle}
                </span>
              </div>
            </div>
          )}

          {/* Vibe Match Reasoning */}
          {user.vibeMatchReasons && user.vibeMatchReasons.length > 0 && (
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2 mb-3 text-[11px] text-indigo-900 font-medium">
              💡 {user.vibeMatchReasons[0]}
            </div>
          )}

          {/* Interest Tags */}
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((interest, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onConnect(user.id)}
          disabled={isConnected}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-200 ${
            isConnected
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-indigo-500/25'
          }`}
        >
          {isConnected ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Connect Request Sent</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>🤝 Connect</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
