'use client';

import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, CheckCircle2, HeartHandshake, Compass } from 'lucide-react';

interface VibeQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (vibeData: {
    socialEnergy: string;
    meetupStyle: string;
    atmosphere: string;
    conversationStyle: string;
    availabilityStyle: string;
    traits: string[];
  }) => void;
}

export function VibeQuestionnaireModal({ isOpen, onClose, onSubmitted }: VibeQuestionnaireModalProps) {
  const [step, setStep] = useState(1);
  const [socialEnergy, setSocialEnergy] = useState('☕ Lowkey & Chill');
  const [meetupStyle, setMeetupStyle] = useState('👥 Small 2-4 Group');
  const [atmosphere, setAtmosphere] = useState('🤫 Quiet & Cozy Cafes');
  const [conversationStyle, setConversationStyle] = useState('🗣️ Deep & Meaningful');
  const [availabilityStyle, setAvailabilityStyle] = useState('⚡ Spontaneous');

  if (!isOpen) return null;

  const handleFinish = () => {
    const traits = [
      socialEnergy.replace(/^[^\w]+/, "").trim(),
      meetupStyle.replace(/^[^\w]+/, "").trim(),
      conversationStyle.replace(/^[^\w]+/, "").trim()
    ];

    onSubmitted({
      socialEnergy,
      meetupStyle,
      atmosphere,
      conversationStyle,
      availabilityStyle,
      traits
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Step {step} of 5 • Set Your Vibe
          </span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* QUESTION 1: Social Energy */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">1. What is your social energy style on weekends?</h3>
            <div className="space-y-2">
              {[
                { title: '⚡ High Energy & Active', desc: 'Outdoors, sports, lively events, and full days.' },
                { title: '☕ Lowkey & Chill', desc: 'Cozy cafes, peaceful walks, and relaxed conversations.' },
                { title: '⚖️ Balanced Ambivert', desc: 'Depends on the mood—happy with both!' }
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setSocialEnergy(opt.title)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    socialEnergy === opt.title
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{opt.title}</div>
                  <div className="text-[11px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 2: Meetup Style */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">2. How do you prefer meeting new friends?</h3>
            <div className="space-y-2">
              {[
                { title: '☕ 1-on-1 Coffee Hangout', desc: 'Focused 1-on-1 connection in a comfortable cafe.' },
                { title: '👥 Small 2-4 Person Circle', desc: 'Cozy small group activity where everyone can talk.' },
                { title: '🚀 Big Community Event', desc: 'Larger groups, photowalks, and community socials.' }
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setMeetupStyle(opt.title)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    meetupStyle === opt.title
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{opt.title}</div>
                  <div className="text-[11px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 3: Atmosphere */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">3. What is your ideal hangout atmosphere?</h3>
            <div className="space-y-2">
              {[
                { title: '🤫 Quiet & Cozy Cafes', desc: 'Espresso spots, bookstores, and calm places.' },
                { title: '🌲 Outdoor Nature & Parks', desc: 'Beach photowalks, parks, and fresh air.' },
                { title: '🎵 Upbeat & Social Venues', desc: 'Board game cafes, sports arenas, and vibrant places.' }
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setAtmosphere(opt.title)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    atmosphere === opt.title
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{opt.title}</div>
                  <div className="text-[11px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 4: Conversation Style */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">4. How do you like to converse?</h3>
            <div className="space-y-2">
              {[
                { title: '🗣️ Deep & Meaningful', desc: 'Life goals, photography, books, and real topics.' },
                { title: '😂 Fun & Casual Icebreakers', desc: 'Laughter, games, banter, and light conversation.' },
                { title: '💡 Tech & Creative Discussions', desc: 'Startups, coding, art, design, and projects.' }
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setConversationStyle(opt.title)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    conversationStyle === opt.title
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{opt.title}</div>
                  <div className="text-[11px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 5: Availability Style */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">5. How do you schedule social plans?</h3>
            <div className="space-y-2">
              {[
                { title: '⚡ Spontaneous "I\'m Free"', desc: 'Decide same-day when free time opens up.' },
                { title: '🗓️ Planned Ahead', desc: 'Prefer booking meetups a few days in advance.' }
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setAvailabilityStyle(opt.title)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    availabilityStyle === opt.title
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{opt.title}</div>
                  <div className="text-[11px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              Back
            </button>
          ) : <div></div>}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Save Vibe Vector</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
