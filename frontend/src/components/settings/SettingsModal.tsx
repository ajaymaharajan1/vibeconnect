'use client';

import React, { useState } from 'react';
import { X, Settings, User, MapPin, Bell, Shield, Moon, Save } from 'lucide-react';
import { getApiUrl, getAuthHeaders } from '../../config/api.config';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onSaveSuccess: (updatedUser: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'location' | 'notifications' | 'privacy' | 'appearance'>('account');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [currentCity, setCurrentCity] = useState(currentUser?.city || 'Chennai');
  
  // Privacy toggles
  const [hideDistance, setHideDistance] = useState(currentUser?.privacySettings?.hideDistance || false);
  const [hideOnlineStatus, setHideOnlineStatus] = useState(currentUser?.privacySettings?.hideOnlineStatus || false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl('/api/profile/update'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, city: currentCity }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSaveSuccess(data.user);
      } else {
        onSaveSuccess({ ...currentUser, name, city: currentCity });
      }
    } catch (err) {
      onSaveSuccess({ ...currentUser, name, city: currentCity });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-800 text-slate-300">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Settings & Preferences</h2>
              <p className="text-xs text-slate-400">Account, Location, Notifications & Privacy controls</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'account' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'location' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Location
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'notifications' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Notifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Privacy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'appearance' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Theme
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Discovery City</label>
                <select
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Chennai">Chennai, Tamil Nadu</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-xs text-white font-medium">Hide Distance from Profile</span>
                <input
                  type="checkbox"
                  checked={hideDistance}
                  onChange={(e) => setHideDistance(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-slate-900"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-xs text-white font-medium">Hide Online Status</span>
                <input
                  type="checkbox"
                  checked={hideOnlineStatus}
                  onChange={(e) => setHideOnlineStatus(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-slate-900"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300">
              🌙 Dark Mode is currently active as the default VibeConnect theme.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
