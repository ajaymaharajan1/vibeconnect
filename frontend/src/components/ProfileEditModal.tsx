'use client';

import React, { useState } from 'react';
import { X, Camera, Shield, Globe, Heart, Sparkles, Check, Save } from 'lucide-react';

interface ProfileEditModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedUser: any) => void;
}

const AVAILABLE_LANGUAGES = ['English', 'Tamil', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin'];
const SOCIAL_INTENTIONS = [
  'Friendship & Activity Partners',
  'Casual Weekend Hangouts',
  'Fitness & Workout Buddies',
  'Networking & Tech Collaboration',
  'Foodie & Coffee Exploring',
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ user, isOpen, onClose, onSaveSuccess }) => {
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || 24);
  const [city, setCity] = useState(user?.city || 'Chennai');
  const [bio, setBio] = useState(user?.bio || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    Array.isArray(user?.languages) ? user.languages : ['English']
  );
  const [interests, setInterests] = useState<string>(
    Array.isArray(user?.interests) ? user.interests.join(', ') : 'Tech, Photography, Coffee'
  );
  const [activities, setActivities] = useState<string>(
    Array.isArray(user?.activities) ? user.activities.join(', ') : 'Street Photowalk, Running'
  );
  const [socialIntentions, setSocialIntentions] = useState(
    user?.socialIntentions || 'Friendship & Activity Partners'
  );
  const [personalityType, setPersonalityType] = useState(user?.personalityType || 'Ambivert');

  // Privacy toggles
  const [hideDistance, setHideDistance] = useState(user?.privacySettings?.hideDistance || false);
  const [hideOnlineStatus, setHideOnlineStatus] = useState(user?.privacySettings?.hideOnlineStatus || false);
  const [onlyFriendsCanView, setOnlyFriendsCanView] = useState(user?.privacySettings?.onlyFriendsCanView || false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mandatory profile picture check
    if (!photoUrl.trim()) {
      setError('Profile picture URL is mandatory to setup your profile.');
      return;
    }

    setLoading(true);
    try {
      const interestsArray = interests.split(',').map((s) => s.trim()).filter(Boolean);
      const activitiesArray = activities.split(',').map((s) => s.trim()).filter(Boolean);

      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          city,
          bio,
          photoUrl,
          languages: selectedLanguages,
          interests: interestsArray,
          activities: activitiesArray,
          socialIntentions,
          personalityType,
        }),
      });

      // Update privacy settings
      await fetch('http://127.0.0.1:5000/api/profile/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hideDistance,
          hideOnlineStatus,
          onlyFriendsCanView,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSaveSuccess({
          ...data.user,
          privacySettings: { hideDistance, hideOnlineStatus, onlyFriendsCanView },
        });
        onClose();
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-600/20 text-violet-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Profile & Privacy</h2>
              <p className="text-xs text-slate-400">Personalize your social card & match preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* Photo & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <div className="relative">
              <img
                src={photoUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-violet-500/50 shadow-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const avatarId = Math.floor(Math.random() * 1000);
                  setPhotoUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}`);
                }}
                className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-full text-white hover:bg-violet-500 transition shadow-md"
                title="Generate Random Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Profile Picture URL (Mandatory)
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Name, Age, City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={18}
                max={99}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">About Me (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell others what kind of hangouts you love..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" /> Languages Spoken
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests & Activities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-pink-400" /> Interests (comma separated)
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Tech, Photography, Movies"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Favorite Activities
              </label>
              <input
                type="text"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                placeholder="Cafe Hopping, Board Games, Running"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Personality & Social Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Personality Energy</label>
              <select
                value={personalityType}
                onChange={(e) => setPersonalityType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Introvert">Introvert (Quiet & Focused)</option>
                <option value="Ambivert">Ambivert (Balanced Social Vibe)</option>
                <option value="Extrovert">Extrovert (High Energy & Outgoing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Social Intention</label>
              <select
                value={socialIntentions}
                onChange={(e) => setSocialIntentions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                {SOCIAL_INTENTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy Settings Section */}
          <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Privacy Controls
            </h3>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-white font-medium block">Hide Distance from Public Profile</span>
                <span className="text-xs text-slate-400">Other users will only see your city instead of exact km</span>
              </div>
              <input
                type="checkbox"
                checked={hideDistance}
                onChange={(e) => setHideDistance(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-900"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-800">
              <div>
                <span className="text-sm text-white font-medium block">Hide Online / Activity Status</span>
                <span className="text-xs text-slate-400">Do not show when you were last active</span>
              </div>
              <input
                type="checkbox"
                checked={hideOnlineStatus}
                onChange={(e) => setHideOnlineStatus(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-900"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-800">
              <div>
                <span className="text-sm text-white font-medium block">Private Profile (Mutual Connections Only)</span>
                <span className="text-xs text-slate-400">Only accepted friends can view your bio & full details</span>
              </div>
              <input
                type="checkbox"
                checked={onlyFriendsCanView}
                onChange={(e) => setOnlyFriendsCanView(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
