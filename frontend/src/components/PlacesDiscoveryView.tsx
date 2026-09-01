'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Star, ExternalLink, SlidersHorizontal, Map, List, Navigation, Clock, Sparkles } from 'lucide-react';
import { getApiUrl } from '../config/api.config';

interface PlacesDiscoveryViewProps {
  currentCity: string;
  onSelectPlaceForMeetup?: (place: any) => void;
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Places', icon: '📍' },
  { id: 'CAFES', label: 'Cafés', icon: '☕' },
  { id: 'THEATRES', label: 'Theatres', icon: '🎬' },
  { id: 'MALLS', label: 'Malls', icon: '🛍️' },
  { id: 'RESTAURANTS', label: 'Restaurants', icon: '🍽️' },
  { id: 'GAMING', label: 'Gaming', icon: '🎮' },
  { id: 'SPORTS', label: 'Sports', icon: '🏸' },
  { id: 'FITNESS', label: 'Fitness', icon: '🏋️' },
  { id: 'ACTIVITIES', label: 'Activities', icon: '🎨' },
  { id: 'OUTDOOR', label: 'Outdoor', icon: '🌳' },
  { id: 'ENTERTAINMENT', label: 'Entertainment', icon: '🎳' },
];

export const PlacesDiscoveryView: React.FC<PlacesDiscoveryViewProps> = ({
  currentCity,
  onSelectPlaceForMeetup,
}) => {
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('distance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPlaces();
  }, [currentCity, selectedCategory, sortBy]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const endpoint = getApiUrl(
        `/api/places/nearby?city=${encodeURIComponent(currentCity)}&category=${selectedCategory}&sortBy=${sortBy}`
      );
      const res = await fetch(endpoint);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.places)) {
        setPlaces(data.places);
      } else {
        // Fallback pre-loaded places
        setPlaces([
          {
            id: 'p1',
            name: 'Blue Tokai Coffee Roasters',
            category: 'CAFES',
            address: 'Nungambakkam High Rd, Chennai',
            rating: 4.8,
            userRatingsTotal: 340,
            isOpenNow: true,
            photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
            googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Blue+Tokai+Coffee+Nungambakkam',
          },
          {
            id: 'p2',
            name: 'PVR VR Mall',
            category: 'THEATRES',
            address: 'Anna Nagar West, Chennai',
            rating: 4.7,
            userRatingsTotal: 1200,
            isOpenNow: true,
            photoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
            googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=PVR+VR+Mall+Chennai',
          },
        ]);
      }
    } catch (err) {
      setPlaces([
        {
          id: 'p1',
          name: 'Blue Tokai Coffee Roasters',
          category: 'CAFES',
          address: 'Nungambakkam High Rd, Chennai',
          rating: 4.8,
          userRatingsTotal: 340,
          isOpenNow: true,
          photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
          googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Blue+Tokai+Coffee+Nungambakkam',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGoogleMaps = (googleMapsUrl: string) => {
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-violet-400" /> Nearby Meetup Spots in {currentCity}
          </h2>
          <p className="text-xs text-slate-400">Discover verified cafes, theatres, malls & sports venues with Google Maps navigation</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="distance">📍 Nearest Distance</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="popularity">🔥 Popular Venues</option>
              <option value="open_now">🕐 Open Now</option>
            </select>
          </div>

          {/* List vs Map View Selector */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Map View
            </button>
          </div>
        </div>
      </div>

      {/* 10 Category Chips Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* List View */}
      {viewMode === 'list' ? (
        loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Sparkles className="w-6 h-6 text-violet-400 animate-spin mx-auto mb-2" />
            Searching Google Maps places in {currentCity}...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-violet-500/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-slate-800 relative overflow-hidden">
                    <img
                      src={
                        place.photoUrl ||
                        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold rounded-lg flex items-center gap-1 border border-slate-800">
                      <Star className="w-3 h-3 fill-amber-400" /> {place.rating || 4.5} ({place.userRatingsTotal || 120}+)
                    </span>
                    {place.isOpenNow && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" /> Open Now
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="px-2 py-0.5 bg-violet-500/10 text-violet-300 border border-violet-500/30 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {place.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{place.address}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => handleOpenGoogleMaps(place.googleMapsUrl)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-violet-400" /> Open in Google Maps
                  </button>
                  {onSelectPlaceForMeetup && (
                    <button
                      onClick={() => onSelectPlaceForMeetup(place)}
                      className="px-3.5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Select Spot
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Map View Simulation */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col justify-center items-center">
          <div className="w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {places.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => handleOpenGoogleMaps(p.googleMapsUrl)}
                style={{
                  top: `${30 + (idx * 20) % 50}%`,
                  left: `${20 + (idx * 30) % 65}%`,
                }}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition z-10"
              >
                <div className="px-3 py-1.5 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-xl flex items-center gap-1 border border-violet-400/50">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {p.name.split(' ')[0]}
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-slate-300 border border-slate-800 font-semibold">
              📍 Map Region: {currentCity} • Click pin to navigate
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
