'use client';

import React from 'react';
import { SlidersHorizontal, MapPin, Users, Calendar, Flame, Sparkles, Search } from 'lucide-react';

interface DiscoveryFilterBarProps {
  activeTab: 'people' | 'communities' | 'events' | 'meetups';
  setActiveTab: (tab: 'people' | 'communities' | 'events' | 'meetups') => void;
  distanceKm: number;
  setDistanceKm: (val: number) => void;
  minAge: number;
  setMinAge: (val: number) => void;
  maxAge: number;
  setMaxAge: (val: number) => void;
  city: string;
  setCity: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export const DiscoveryFilterBar: React.FC<DiscoveryFilterBarProps> = ({
  activeTab,
  setActiveTab,
  distanceKm,
  setDistanceKm,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  city,
  setCity,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('people')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'people'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> People
          </button>
          <button
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'communities'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Communities
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Events
          </button>
          <button
            onClick={() => setActiveTab('meetups')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'meetups'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Meetups
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab} by vibe, interest, or keywords...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Discovery Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Distance Slider */}
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

        {/* Age Range Filter */}
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

        {/* City Dropdown */}
        <div className="space-y-1">
          <label className="text-xs text-slate-300 font-medium block">City Filter</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="All">All Cities</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="space-y-1">
          <label className="text-xs text-slate-300 font-medium block flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" /> Sort Results
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="vibe_match">⭐ Highest Vibe Match %</option>
            <option value="distance">📍 Nearest Distance</option>
            <option value="reliability">🛡️ Highest Reliability Score</option>
          </select>
        </div>
      </div>
    </div>
  );
};
