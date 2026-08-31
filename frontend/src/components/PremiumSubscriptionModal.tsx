'use client';

import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Megaphone, Zap, ShieldCheck } from 'lucide-react';

interface PremiumSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PremiumSubscriptionModal: React.FC<PremiumSubscriptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('QUARTERLY');
  const [loading, setLoading] = useState(false);
  const [showAdCreator, setShowAdCreator] = useState(false);

  // Business Ad Fields
  const [adTitle, setAdTitle] = useState('');
  const [adDesc, setAdDesc] = useState('');
  const [adImage, setAdImage] = useState('');
  const [adTargetCity, setAdTargetCity] = useState('Chennai');

  if (!isOpen) return null;

  const handleRazorpaySubscribe = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/premium/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planTier: selectedPlan }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`🎉 ${data.message}`);
        onSuccess();
        onClose();
      } else {
        alert(data.error || 'Subscription failed');
      }
    } catch (err: any) {
      alert(err.message || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/premium/create-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: adTitle,
          description: adDesc,
          imageUrl: adImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
          targetCity: adTargetCity,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('📢 Business Ad Campaign Published Successfully!');
        setShowAdCreator(false);
      } else {
        alert(data.error || 'Failed to create ad campaign');
      }
    } catch (err: any) {
      alert(err.message || 'Ad creation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!showAdCreator ? (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 mb-1">
                <Crown className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">VibeConnect Premium</h2>
              <p className="text-xs text-slate-400">Unlock Priority Discovery, Advanced Filters & Business Advertising</p>
            </div>

            {/* Perks List */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <Zap className="w-4 h-4 text-amber-400" /> Priority Profile Discovery
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Megaphone className="w-4 h-4 text-pink-400" /> Business Event Ads
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Sparkles className="w-4 h-4 text-violet-400" /> Exclusive Premium Badge
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Unlimited Direct Requests
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan('MONTHLY')}
                className={`p-4 rounded-2xl border text-center transition ${
                  selectedPlan === 'MONTHLY'
                    ? 'bg-violet-600/20 border-violet-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold uppercase mb-1">Monthly</div>
                <div className="text-lg font-black text-amber-400">₹299</div>
                <div className="text-[10px] text-slate-400">/ month</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('QUARTERLY')}
                className={`p-4 rounded-2xl border text-center transition relative ${
                  selectedPlan === 'QUARTERLY'
                    ? 'bg-violet-600/20 border-violet-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full">
                  MOST POPULAR
                </span>
                <div className="text-xs font-bold uppercase mb-1">Quarterly</div>
                <div className="text-lg font-black text-amber-400">₹699</div>
                <div className="text-[10px] text-slate-400">3 Months</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('YEARLY')}
                className={`p-4 rounded-2xl border text-center transition ${
                  selectedPlan === 'YEARLY'
                    ? 'bg-violet-600/20 border-violet-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold uppercase mb-1">Yearly</div>
                <div className="text-lg font-black text-amber-400">₹1,999</div>
                <div className="text-[10px] text-slate-400">Save 45%</div>
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRazorpaySubscribe}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-pink-500 to-violet-600 hover:opacity-90 text-slate-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Crown className="w-5 h-5 fill-slate-950" />
                {loading ? 'Processing Razorpay...' : `Subscribe via Razorpay (${selectedPlan})`}
              </button>

              <button
                onClick={() => setShowAdCreator(true)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
              >
                📢 Create Business Ad Campaign (Premium Perk)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateAd} className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold text-white">Create Business Ad Campaign</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business / Ad Title</label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="e.g. Blue Tokai Coffee - Weekend 20% Off"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Description</label>
              <textarea
                value={adDesc}
                onChange={(e) => setAdDesc(e.target.value)}
                placeholder="Special hangout offer for VibeConnect community members..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Image URL</label>
              <input
                type="text"
                value={adImage}
                onChange={(e) => setAdImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target City</label>
              <input
                type="text"
                value={adTargetCity}
                onChange={(e) => setAdTargetCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdCreator(false)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs shadow-lg"
              >
                {loading ? 'Publishing...' : 'Publish Ad'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
