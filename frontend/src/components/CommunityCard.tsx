'use client';

import React from 'react';
import { CommunityItem } from '../types';
import { Users, Calendar, ShieldCheck } from 'lucide-react';

interface CommunityCardProps {
  community: CommunityItem;
  onJoin: (id: string) => void;
}

export function CommunityCard({ community, onJoin }: CommunityCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden hover:shadow-lg transition flex flex-col justify-between">
      <div>
        <div className="h-36 w-full relative">
          <img
            src={community.coverUrl}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {community.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-slate-900 mb-1">{community.name}</h3>
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">{community.description}</p>
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5" />
              <span>{community.membersCount} Members</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{community.eventsCount} Events</span>
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => onJoin(community.id)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition"
        >
          Join Community
        </button>
      </div>
    </div>
  );
}
