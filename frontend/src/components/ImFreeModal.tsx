'use client';

import React, { useState } from 'react';
import { X, Clock, Coffee, Sparkles } from 'lucide-react';

interface ImFreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (freeData: {
    isFree: boolean;
    freeStartTime: string;
    freeEndTime: string;
    freeLookingFor: string[];
    freeGroupSize: string;
  }) => void;
}

export function ImFreeModal({ isOpen, onClose, onSave }: ImFreeModalProps) {
  const [startTime, setStartTime] = useState('6:00 PM');
  const [endTime, setEndTime] = useState('9:00 PM');
  const [groupSize, setGroupSize] = useState('2-4 people');
  const [activities, setActivities] = useState<string[]>(['Coffee ☕', 'Walk 🚶']);

  const activityOptions = ['Coffee ☕', 'Walk 🚶', 'Food 🍔', 'Photos 📸', 'Board Games 🎮', 'Shopping 🛍️'];

  if (!isOpen) return null;

  const toggleActivity = (act: string) => {
    if (activities.includes(act)) {
      setActivities(activities.filter(a => a !== act));
    } else {
      setActivities([...activities, act]);
    }
  };

  const handlePublish = () => {
    onSave({
      isFree: true,
      freeStartTime: startTime,
      freeEndTime: endTime,
      freeLookingFor: activities,
      freeGroupSize: groupSize
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Set "I'm Free" Status</h3>
            <p className="text-xs text-slate-500">Let compatible nearby people know you're open to hang out!</p>
          </div>
        </div>

        {/* Time Window */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Time Window Today
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Start Time (e.g. 6:00 PM)"
              />
              <input
                type="text"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="End Time (e.g. 9:00 PM)"
              />
            </div>
          </div>

          {/* Looking For Activities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Looking to do:
            </label>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map(act => (
                <button
                  key={act}
                  type="button"
                  onClick={() => toggleActivity(act)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    activities.includes(act)
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Group Size
            </label>
            <select
              value={groupSize}
              onChange={e => setGroupSize(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="1-on-1">1-on-1 Hangout</option>
              <option value="2-4 people">2-4 People (Small group)</option>
              <option value="5+ people">5+ People (Group social)</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => {
              onSave({ isFree: false, freeStartTime: '', freeEndTime: '', freeLookingFor: [], freeGroupSize: '' });
              onClose();
            }}
            className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
          >
            Turn Off
          </button>
          <button
            onClick={handlePublish}
            className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700"
          >
            🟢 Broadcast "I'm Free"
          </button>
        </div>
      </div>
    </div>
  );
}
