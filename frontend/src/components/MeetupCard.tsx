'use client';

import React, { useState } from 'react';
import { MeetupItem } from '../types';
import { Calendar, MapPin, Star, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface MeetupCardProps {
  meetup: MeetupItem;
  onRSVP: (meetupId: string, status: string) => void;
  onTriggerRescue?: () => void;
}

export function MeetupCard({ meetup, onRSVP, onTriggerRescue }: MeetupCardProps) {
  const [currentRSVP, setCurrentRSVP] = useState('CONFIRMED');

  const handleRSVPChange = (status: string) => {
    setCurrentRSVP(status);
    onRSVP(meetup.id, status);
  };

  const isLowAttendance = meetup.rsvpsCount < meetup.minCapacity;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{meetup.time}</span>
          </span>

          <div className="flex items-center space-x-2">
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>🛟 Meetup Guarantee</span>
            </span>

            <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{meetup.creatorReliability}%</span>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 mb-1">{meetup.title}</h3>
        <p className="text-xs text-slate-600 line-clamp-2 mb-3">{meetup.description}</p>

        {/* Venue Location */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold mb-4 bg-slate-50 p-2 rounded-xl">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>{meetup.venueName}</span>
        </div>

        {/* Attendees Stack & Capacity */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {meetup.attendees.map((att, idx) => (
                <img
                  key={idx}
                  src={att.photoUrl}
                  alt={att.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {meetup.rsvpsCount} / {meetup.maxCapacity} Going
            </span>
          </div>

          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            Max {meetup.maxCapacity} People
          </span>
        </div>

        {/* Meetup Rescue Alert if low attendance */}
        {isLowAttendance && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low Attendance Warning</span>
            </div>
            <p className="text-[11px] text-amber-800 mb-2">
              Only {meetup.rsvpsCount} confirmed attendee. Need 1 more to avoid cancellation!
            </p>
            <button
              onClick={onTriggerRescue}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 rounded-lg flex items-center justify-center space-x-1 shadow-sm transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>🛟 Activate Meetup Rescue</span>
            </button>
          </div>
        )}
      </div>

      {/* RSVP Step Selector */}
      <div className="border-t border-slate-100 pt-4">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Your Attendance Status:
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {['INTERESTED', 'GOING', 'CONFIRMED', 'CHECKED_IN'].map((status) => {
            const isSelected = currentRSVP === status;
            return (
              <button
                key={status}
                onClick={() => handleRSVPChange(status)}
                className={`py-2 px-1 rounded-xl text-[10px] font-bold transition border ${
                  isSelected
                    ? status === 'CHECKED_IN'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {status === 'CHECKED_IN' ? '✅ Checked In' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
