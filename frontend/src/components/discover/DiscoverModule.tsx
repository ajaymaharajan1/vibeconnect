'use client';

import React, { useState } from 'react';
import { Users, Flame, Calendar, MapPin, Search, SlidersHorizontal, Sparkles, Map } from 'lucide-react';
import { VibeCard } from '../VibeCard';
import { CommunityCard } from '../CommunityCard';
import { PlacesDiscoveryView } from '../PlacesDiscoveryView';
import { Ticket } from 'lucide-react';

interface DiscoverModuleProps {
  currentCity: string;
  people: any[];
  communities: any[];
  events: any[];
  onSelectPerson: (id: string) => void;
  onSelectEventTicket: (event: any) => void;
}

export const DiscoverModule: React.FC<DiscoverModuleProps> = ({
  currentCity,
  people,
  communities,
  events,
  onSelectPerson,
  onSelectEventTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'people' | 'communities' | 'events' | 'places'>('people');
  const [distanceKm, setDistanceKm] = useState<number>(25);
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(40);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="space-y-6 pb-20">
      {/* Module Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-violet-400" /> Universal Discovery Engine
          </h1>
          <p className="text-xs text-slate-400">Search people, communities, events & social places in {currentCity}</p>
        </div>
      </div>

      {/* Discover Scoped Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        {/* Category Sub-Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('people')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'people' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> People
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'communities' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Communities
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'events' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Events
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'places' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-pink-400" /> Places
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab} by vibe, interests, or keywords...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Filter Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-violet-400" /> Distance Radius
              </span>
              <span className="text-violet-400 font-bold">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-violet-600 bg-slate-800 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          {activeTab === 'people' && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium block">Age Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={18}
                  max={99}
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-violet-500"
                />
                <span className="text-slate-500 text-xs">-</span>
                <input
                  type="number"
                  min={18}
                  max={99}
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DISCOVER PEOPLE */}
      {activeTab === 'people' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((person) => (
            <div key={person.id} className="relative group">
              <VibeCard user={person} onConnect={() => onSelectPerson(person.id)} isConnected={false} />
              <button
                onClick={() => onSelectPerson(person.id)}
                className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg transition"
              >
                View Vibe Score
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DISCOVER COMMUNITIES */}
      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <CommunityCard key={comm.id} community={comm} onJoin={() => alert(`Joined ${comm.name}`)} />
          ))}
        </div>
      )}

      {/* DISCOVER EVENTS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
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
              <button
                onClick={() => onSelectEventTicket(event)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <Ticket className="w-4 h-4" /> Get Event Pass & QR Ticket
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DISCOVER PLACES */}
      {activeTab === 'places' && (
        <PlacesDiscoveryView currentCity={currentCity} />
      )}
    </div>
  );
};
