'use client';

import React from 'react';
import {
  X,
  User,
  Settings,
  ShieldCheck,
  Crown,
  Bookmark,
  HelpCircle,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onOpenSettings: () => void;
  onOpenVerification: () => void;
  onOpenPremium: () => void;
  onLogout: () => void;
  onNavigateModule: (module: 'home' | 'discover' | 'chats' | 'meetups' | 'profile') => void;
  onOpenSavedItems?: () => void;
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenSettings,
  onOpenVerification,
  onOpenPremium,
  onLogout,
  onNavigateModule,
  onOpenSavedItems,
  onOpenHelp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Background Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Out Drawer Content */}
      <div className="relative w-80 max-w-[80vw] bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header User Card */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/60 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={
                  currentUser?.photoUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                }
                alt={currentUser?.name || 'User'}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-violet-500/50 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-extrabold text-white text-base">{currentUser?.name || 'Guest User'}</h3>
                  {currentUser?.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400">📍 {currentUser?.city || 'Chennai'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1 text-xs font-semibold">
            <button
              onClick={() => {
                onNavigateModule('profile');
                onClose();
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-3 transition cursor-pointer"
            >
              <User className="w-4 h-4 text-violet-400" /> View Profile
            </button>

            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-3 transition cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" /> Settings & Preferences
            </button>

            <button
              onClick={() => {
                onOpenVerification();
                onClose();
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verification Status
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                {currentUser?.isVerified ? 'VERIFIED' : 'GET BADGE'}
              </span>
            </button>

            <button
              onClick={() => {
                onOpenPremium();
                onClose();
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-amber-400" /> VibeConnect Premium
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                PRO
              </span>
            </button>

            <div className="my-2 border-t border-slate-800" />

            <button
              onClick={() => {
                onNavigateModule('home');
                onClose();
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-3 transition cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-pink-400" /> Saved Posts & Meetups
            </button>

            <button
              onClick={() => {
                onNavigateModule('discover');
                onClose();
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-3 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" /> Help & Platform Guide
            </button>
          </div>
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
