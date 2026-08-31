'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, DollarSign, Clock, ShieldCheck, Navigation, Calendar, Send } from 'lucide-react';

interface VenueSuggestion {
  id: string;
  spotName: string;
  category: string;
  address: string;
  expectedCost: string;
  distanceKm: number;
  travelTime: string;
  safetyRating: number;
  safetyLabel: string;
  vibeDescription: string;
  bestMeetingTime: string;
  photoUrl: string;
}

interface AIMeetupPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpot: (spot: VenueSuggestion) => void;
}

export function AIMeetupPlannerModal({ isOpen, onClose, onSelectSpot }: AIMeetupPlannerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<'coffee' | 'fitness' | 'tech' | 'movies'>('coffee');
  const [suggestions, setSuggestions] = useState<VenueSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'coffee', label: 'Coffee ☕', desc: 'Cozy cafes & roasteries' },
    { id: 'fitness', label: 'Fitness 🏋️', desc: 'Beach runs & eco parks' },
    { id: 'tech', label: 'Tech 💻', desc: 'Coworking & coffee lounges' },
    { id: 'movies', label: 'Movies 🎬', desc: 'Multiplexes & culture' }
  ];

  const fetchSuggestions = async (cat: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/meetups/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: cat })
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      // Fallback local suggestions if server loading
      setSuggestions([
        {
          id: 'v-1',
          spotName: 'Blue Tokai Coffee Roasters',
          category: 'Coffee ☕',
          address: 'Khadder Nawaz Khan Road, Nungambakkam, Chennai',
          expectedCost: '₹250 - ₹400 / person',
          distanceKm: 1.2,
          travelTime: '5 mins drive (12 mins walk)',
          safetyRating: 4.9,
          safetyLabel: '🛡️ 4.9/5 Safety Rating • Public & High Security',
          vibeDescription: 'Cozy artisanal coffee shop with outdoor seating & relaxed music.',
          bestMeetingTime: '5:00 PM - 7:30 PM',
          photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions(selectedCategory);
    }
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-indigo-100 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI Meetup Planner</h3>
            <p className="text-xs text-slate-500">Removes friction: AI suggests best spot, cost, travel time, and safety rating!</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-100 p-1.5 rounded-2xl">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-white text-indigo-600 shadow-md border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Suggestion Cards Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">
              ✨ AI is analyzing nearby locations, costs & safety ratings...
            </div>
          ) : suggestions.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-4 flex flex-col sm:flex-row gap-4"
            >
              <img
                src={venue.photoUrl}
                alt={venue.spotName}
                className="w-full sm:w-44 h-36 rounded-xl object-cover"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-bold text-slate-900">{venue.spotName}</h4>
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {venue.safetyLabel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>{venue.address}</span>
                  </p>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    "{venue.vibeDescription}"
                  </p>

                  {/* Parameters Grid: Cost, Distance, Travel Time, Best Time */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-700">{venue.expectedCost}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-700">{venue.distanceKm} km away</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span className="font-semibold text-slate-700">{venue.travelTime}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-slate-700">{venue.bestMeetingTime}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectSpot(venue);
                    onClose();
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Choose This Spot & Invite to Meet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
