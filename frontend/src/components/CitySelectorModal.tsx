'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Check, Navigation, Sparkles, Building2 } from 'lucide-react';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onCitySelected: (city: any) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onCitySelected,
}) => {
  const [activeCities, setActiveCities] = useState<any[]>([]);
  const [comingSoonCities, setComingSoonCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [physicalGpsCity, setPhysicalGpsCity] = useState<string>('Chennai');

  useEffect(() => {
    if (isOpen) {
      fetchCities();
    }
  }, [isOpen]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/cities');
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveCities(data.activeCities);
        setComingSoonCities(data.comingSoonCities);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSelect = async (city: any) => {
    try {
      const token = localStorage.getItem('vibeconnect_token');
      await fetch('http://127.0.0.1:5000/api/users/city', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ discoveryCityId: city.id }),
      });
      onCitySelected(city);
      onClose();
    } catch (err) {
      onCitySelected(city);
      onClose();
    }
  };

  const handleUseGPS = () => {
    // Detect device physical location (Simulated GPS)
    const detected = 'Bengaluru';
    setPhysicalGpsCity(detected);
    const target = activeCities.find((c) => c.name === detected) || { name: detected };
    handleSelect(target);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-600/20 text-violet-400 rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Select Discovery City</h2>
              <p className="text-xs text-slate-400">Explore people, meetups & places in active cities</p>
            </div>
          </div>

          {/* Device Location Button */}
          <button
            onClick={handleUseGPS}
            className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 text-violet-300 border border-slate-700 rounded-2xl text-xs font-bold flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-violet-400 animate-pulse" /> Use Device Current Location (GPS)
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md">Auto Detect</span>
          </button>

          {/* Active Cities */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Active VibeConnect Cities
            </span>

            <div className="space-y-2">
              {activeCities.map((city) => {
                const isSelected = currentCity.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 text-violet-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{city.name}</div>
                        <div className="text-xs text-slate-400">{city.state}, {city.country}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2.5 py-1 bg-violet-600 text-white rounded-full text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coming Soon Cities */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Coming Soon to Other Cities
            </span>

            <div className="grid grid-cols-2 gap-2">
              {comingSoonCities.map((c) => (
                <div
                  key={c.name}
                  className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs text-slate-400 flex items-center justify-between"
                >
                  <span>📍 {c.name}</span>
                  <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Soon</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
