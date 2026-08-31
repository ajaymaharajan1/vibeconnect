'use client';

import React from 'react';
import { X, AlertTriangle, ShieldCheck, RefreshCw, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RescueOption {
  id: string;
  type: string;
  title: string;
  categoryIcon: string;
  distanceKm: number;
  venueName: string;
  time: string;
  attendeesCount: number;
  matchReason: string;
}

interface MeetupRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetupTitle?: string;
  confirmedCount?: number;
  onTransferRSVP: (option: RescueOption) => void;
}

export function MeetupRescueModal({
  isOpen,
  onClose,
  meetupTitle = 'Saturday Sunset Coffee & Chat',
  confirmedCount = 1,
  onTransferRSVP
}: MeetupRescueModalProps) {
  if (!isOpen) return null;

  const fallbackOptions: RescueOption[] = [
    {
      id: 'res-coffee-1',
      type: 'COFFEE',
      title: '☕ Saturday Coffee & Chill Meetup',
      categoryIcon: '☕',
      distanceKm: 0.7,
      venueName: 'Blue Tokai Coffee, Nungambakkam',
      time: '6:30 PM Today',
      attendeesCount: 3,
      matchReason: 'Matches your coffee & chill vibe preferences'
    },
    {
      id: 'res-walk-2',
      type: 'WALKING',
      title: '🚶 Sunset Beach Photowalk & Walking Group',
      categoryIcon: '🚶',
      distanceKm: 1.2,
      venueName: 'Marina Beach Promenade',
      time: '5:30 PM Today',
      attendeesCount: 12,
      matchReason: 'Active community group with high attendance'
    },
    {
      id: 'res-game-3',
      type: 'GAMING',
      title: '🎮 Casual Board Games & Conversation',
      categoryIcon: '🎮',
      distanceKm: 1.5,
      venueName: 'Board Game Cafe, T. Nagar',
      time: '7:00 PM Today',
      attendeesCount: 4,
      matchReason: 'Open spots available for spontaneous join'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shadow-sm">
            🛟
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">Meetup Guarantee Active</h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                Rescue Activated
              </span>
            </div>
            <p className="text-xs text-slate-500">"What if nobody shows up?" VibeConnect guarantees you'll never be left stranded!</p>
          </div>
        </div>

        {/* Threshold Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-4 text-xs">
          <div className="flex items-center space-x-2 text-amber-900 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Low Attendance Warning on "{meetupTitle}"</span>
          </div>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Only <strong>{confirmedCount} confirmed attendee</strong> for this meetup. Our Meetup Guarantee has automatically scanned active nearby alternatives so your outing is saved!
          </p>
        </div>

        {/* Nearby Fallback Alternatives List */}
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Nearby Active Alternatives (Within 1.5 km):
        </h4>

        <div className="space-y-2.5 mb-6 max-h-72 overflow-y-auto pr-1">
          {fallbackOptions.map((opt) => (
            <div
              key={opt.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 hover:border-amber-400 hover:bg-amber-50/50 transition flex items-center justify-between group"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 transition">
                    {opt.title}
                  </h5>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {opt.attendeesCount} Confirmed
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{opt.venueName} ({opt.distanceKm} km away)</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => onTransferRSVP(opt)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition flex items-center space-x-1 flex-shrink-0 ml-2"
              >
                <span>Transfer RSVP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
        >
          Keep Waiting on Original Meetup
        </button>
      </div>
    </div>
  );
}
