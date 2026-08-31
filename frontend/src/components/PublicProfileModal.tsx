'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, UserPlus, Check, Ban, Globe, Shield, Heart, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';

interface PublicProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat?: (chatRoomId?: string) => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ userId, isOpen, onClose, onOpenChat }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionState, setConnectionState] = useState<string>('none'); // none, pending, accepted, rejected, cancelled, blocked
  const [isRequester, setIsRequester] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchPublicProfile();
    }
  }, [isOpen, userId]);

  const fetchPublicProfile = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch(`http://127.0.0.1:5000/api/profile/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileData(data);
        setConnectionState(data.connectionState || 'none');
        setIsRequester(data.isRequester || false);
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = async (action: 'send' | 'accept' | 'reject' | 'cancel' | 'block' | 'unblock') => {
    if (!userId) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const endpoint = `http://127.0.0.1:5000/api/connections/${action}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: userId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (action === 'send') {
          setConnectionState('pending');
          setIsRequester(true);
        } else if (action === 'accept') {
          setConnectionState('accepted');
          if (data.chatRoomId && onOpenChat) {
            onOpenChat(data.chatRoomId);
          }
        } else if (action === 'reject') {
          setConnectionState('rejected');
        } else if (action === 'cancel') {
          setConnectionState('none');
        } else if (action === 'block') {
          setConnectionState('blocked');
        } else if (action === 'unblock') {
          setConnectionState('none');
        }
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error processing action');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  const user = profileData?.user;
  const vibeMatch = profileData?.vibeMatch;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Sparkles className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
            <p>Loading Vibe Profile & Compatibility...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Private Profile</h3>
            <p className="text-sm text-slate-400">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        ) : user ? (
          <div>
            {/* Header Banner & Avatar */}
            <div className="h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 relative">
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-900 absolute -bottom-8 left-6 shadow-xl"
              />
            </div>

            <div className="pt-10 px-6 pb-6 space-y-5">
              {/* User Identity */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    {user.name}, <span className="text-violet-400 font-medium">{user.age}</span>
                  </h2>
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 rounded-full text-xs font-semibold">
                    {user.personalityType || 'Ambivert'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-violet-400" /> {user.city}
                </p>
              </div>

              {/* Vibe Match Compatibility Card */}
              {vibeMatch && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/60 to-purple-950/60 border border-violet-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Vibe Compatibility
                    </span>
                    <span className="text-xl font-black text-amber-400">
                      {vibeMatch.matchPercentage}% Match
                    </span>
                  </div>

                  {/* Reasons list */}
                  <div className="space-y-1">
                    {vibeMatch.matchingReasons.map((reason: string, idx: number) => (
                      <p key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        {reason}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bio</h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {user.bio || 'Passionate about exploring cafes, photowalks, and tech meetups!'}
                </p>
              </div>

              {/* Languages & Interests */}
              <div className="space-y-3">
                {Array.isArray(user.languages) && user.languages.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" /> Languages:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.languages.map((lang: string) => (
                        <span key={lang} className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 rounded-lg text-xs font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(user.interests) && user.interests.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-400" /> Interests:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.interests.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-pink-500/10 text-pink-300 rounded-lg text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Connection State Machine Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                {connectionState === 'accepted' ? (
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={() => onOpenChat && onOpenChat()}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition"
                    >
                      <MessageSquare className="w-4 h-4" /> Mutual Friend (Open Chat)
                    </button>
                    <button
                      onClick={() => handleConnectionAction('block')}
                      disabled={actionLoading}
                      className="p-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl border border-rose-500/30 transition"
                      title="Block User"
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                  </div>
                ) : connectionState === 'pending' ? (
                  isRequester ? (
                    <div className="flex-1 flex gap-2">
                      <div className="flex-1 py-3 bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
                        <UserCheck className="w-4 h-4" /> Connection Pending...
                      </div>
                      <button
                        onClick={() => handleConnectionAction('cancel')}
                        disabled={actionLoading}
                        className="px-4 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
                      >
                        Cancel Request
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex gap-2">
                      <button
                        onClick={() => handleConnectionAction('accept')}
                        disabled={actionLoading}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleConnectionAction('reject')}
                        disabled={actionLoading}
                        className="px-4 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
                      >
                        Decline
                      </button>
                    </div>
                  )
                ) : connectionState === 'blocked' ? (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                      <Ban className="w-4 h-4" /> User Blocked
                    </span>
                    <button
                      onClick={() => handleConnectionAction('unblock')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Unblock
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={() => handleConnectionAction('send')}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition"
                    >
                      <UserPlus className="w-4 h-4" /> Send Connection Request
                    </button>
                    <button
                      onClick={() => handleConnectionAction('block')}
                      disabled={actionLoading}
                      className="p-3 bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-xl transition"
                      title="Block User"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
