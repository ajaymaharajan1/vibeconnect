'use client';

import React from 'react';
import { Home, Compass, MessageSquare, Handshake, User } from 'lucide-react';

interface BottomNavProps {
  activeModule: 'home' | 'discover' | 'chats' | 'meetups' | 'profile';
  setActiveModule: (module: 'home' | 'discover' | 'chats' | 'meetups' | 'profile') => void;
  unreadChatCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  setActiveModule,
  unreadChatCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl py-2 px-4">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveModule('home')}
          className={`flex flex-col items-center gap-1 transition ${
            activeModule === 'home'
              ? 'text-violet-400 scale-105 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Discover */}
        <button
          onClick={() => setActiveModule('discover')}
          className={`flex flex-col items-center gap-1 transition ${
            activeModule === 'discover'
              ? 'text-violet-400 scale-105 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Discover</span>
        </button>

        {/* Chats */}
        <button
          onClick={() => setActiveModule('chats')}
          className={`flex flex-col items-center gap-1 transition relative ${
            activeModule === 'chats'
              ? 'text-violet-400 scale-105 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Chats</span>
        </button>

        {/* Meetups */}
        <button
          onClick={() => setActiveModule('meetups')}
          className={`flex flex-col items-center gap-1 transition ${
            activeModule === 'meetups'
              ? 'text-violet-400 scale-105 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <Handshake className="w-5 h-5" />
          <span className="text-[10px]">Meetups</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveModule('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            activeModule === 'profile'
              ? 'text-violet-400 scale-105 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </nav>
  );
};
