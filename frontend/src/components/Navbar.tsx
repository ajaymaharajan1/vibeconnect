'use client';

import React from 'react';
import { Users, Calendar, MessageSquare, Compass, LogIn, LogOut, ShieldCheck, Sparkles, Crown, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isFree: boolean;
  onToggleFree: () => void;
  currentUser: { name: string; photoUrl: string; isVerified?: boolean; isPremium?: boolean } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenQuestionnaire: () => void;
  onOpenPremium?: () => void;
  onOpenAdmin?: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  isFree,
  onToggleFree,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenQuestionnaire,
  onOpenPremium,
  onOpenAdmin
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('discover')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
              V
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                VibeConnect
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-medium ml-2">
                📍 Chennai
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'discover'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('meetups')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'meetups'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Meetups & Events</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'chat'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat & Games</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'feed'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Feed</span>
            </button>
          </nav>

          {/* Right Side User Profile & Quick Action Modals */}
          <div className="flex items-center space-x-2">
            {/* Premium Button */}
            {onOpenPremium && (
              <button
                onClick={onOpenPremium}
                className="bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-400" />
                <span className="hidden md:inline">Premium</span>
              </button>
            )}

            {/* Admin Panel Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Auth / Profile Area */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-full border border-slate-700">
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <span className="text-xs font-bold text-white pr-1">{currentUser.name}</span>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="p-1 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
