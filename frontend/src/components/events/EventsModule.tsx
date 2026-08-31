'use client';

import React, { useState } from 'react';
import { Calendar, Ticket, Plus, Sparkles, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface EventsModuleProps {
  events: any[];
  onSelectEventTicket: (event: any) => void;
}

export const EventsModule: React.FC<EventsModuleProps> = ({ events, onSelectEventTicket }) => {
  const [tab, setTab] = useState<'upcoming' | 'popular' | 'free' | 'paid' | 'tickets'>('upcoming');

  const filteredEvents = events.filter((e) => {
    if (tab === 'free') return !e.isPaid;
    if (tab === 'paid') return e.isPaid;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-violet-400" /> Dedicated Events Hub
          </h1>
          <p className="text-xs text-slate-400">Discover upcoming events, workshops & get cryptographic QR passes</p>
        </div>

        <button
          onClick={() => alert('Create Event: Organizer form setup!')}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit overflow-x-auto">
        <button
          onClick={() => setTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'upcoming' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => setTab('free')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'free' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Free Events
        </button>
        <button
          onClick={() => setTab('paid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'paid' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Paid Events
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-violet-500/40 transition">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 bg-violet-500/10 text-violet-300 border border-violet-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {event.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{event.title}</h3>
              </div>
              <span className="text-emerald-400 font-extrabold text-sm">
                {event.isPaid ? `₹${event.price}` : 'FREE'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>📍 {event.venueName}</span>
              <span>🕒 {event.date}</span>
            </div>

            <button
              onClick={() => onSelectEventTicket(event)}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Ticket className="w-4 h-4" /> Get Event Pass & QR Ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
