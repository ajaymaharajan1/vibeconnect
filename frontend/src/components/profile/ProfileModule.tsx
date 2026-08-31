'use client';

import React from 'react';
import { User, MapPin, Globe, ShieldCheck, Heart, Sparkles, Settings, Edit3, Camera } from 'lucide-react';
import { SocialFeedCard } from '../SocialFeedCard';

interface ProfileModuleProps {
  currentUser: any;
  posts: any[];
  onOpenEditProfile: () => void;
  onOpenVerification: () => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({
  currentUser,
  posts,
  onOpenEditProfile,
  onOpenVerification,
}) => {
  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="h-36 bg-gradient-to-r from-violet-900 via-purple-900 to-pink-900 relative">
          <button
            onClick={onOpenEditProfile}
            className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full transition border border-slate-700"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-12 px-6 pb-6 space-y-6 relative">
          {/* Avatar */}
          <img
            src={
              currentUser?.photoUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
            }
            alt={currentUser?.name || 'User'}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-900 absolute -top-12 left-6 shadow-xl"
          />

          {/* Identity & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{currentUser?.name || 'Ajay'}</h1>
                {currentUser?.isVerified && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-violet-400" /> {currentUser?.city || 'Chennai'}
              </p>
            </div>

            <div className="flex gap-2">
              {!currentUser?.isVerified && (
                <button
                  onClick={onOpenVerification}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" /> Get Verified Badge
                </button>
              )}
              <button
                onClick={onOpenEditProfile}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-center">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Reliability Score</span>
              <span className="text-lg font-black text-amber-400">98.5%</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Mutual Friends</span>
              <span className="text-lg font-black text-violet-400">14</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Meetups Attended</span>
              <span className="text-lg font-black text-emerald-400">8</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About Me</h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              {currentUser?.bio || 'Tech builder, weekend photowalk explorer, and coffee lover based in Chennai!'}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">My Social Posts & Memories</h3>
        <div className="space-y-6">
          {posts.map((post) => (
            <SocialFeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
