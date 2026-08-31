'use client';

import React, { useState } from 'react';
import { Send, Gamepad2, PhoneCall, CheckCircle2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { FriendshipJourneyWidget } from './FriendshipJourneyWidget';

interface ChatWindowProps {
  roomName: string;
  roomPhoto?: string;
  messages: ChatMessage[];
  onSendMessage: (text: string, type?: string, metadata?: any) => void;
  onLaunchGame: (gameType: string) => void;
  onOpenAIPlanner?: () => void;
  starterPrompt?: string;
}

export function ChatWindow({
  roomName,
  roomPhoto,
  messages,
  onSendMessage,
  onLaunchGame,
  onOpenAIPlanner,
  starterPrompt
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [selectedGameChoice, setSelectedGameChoice] = useState<{ [msgId: string]: string }>({});

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleGameSelect = (msgId: string, option: string) => {
    setSelectedGameChoice(prev => ({ ...prev, [msgId]: option }));
  };

  return (
    <div className="flex flex-col h-[720px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
            <img
              src={roomPhoto || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"}
              alt={roomName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center space-x-2">
              <span>{roomName}</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                🔥 78% Friendship Strength
              </span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online • Mutual Connection</span>
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2">
          {onOpenAIPlanner && (
            <button
              onClick={onOpenAIPlanner}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold transition flex items-center space-x-1 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>AI Meetup Planner</span>
            </button>
          )}

          <button
            title="1-on-1 Voice Call"
            onClick={() => alert("📞 Voice Intro: Initiating 1-on-1 audio call to unlock next Friendship Journey milestone!")}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-semibold flex items-center space-x-1"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Voice Call</span>
          </button>
        </div>
      </div>

      {/* Friendship Journey Score Widget */}
      <div className="p-3 bg-slate-100 border-b border-slate-200">
        <FriendshipJourneyWidget friendName={roomName} strengthScore={78} />
      </div>

      {/* Conversation Starter Recommendation Banner */}
      {starterPrompt && (
        <div className="bg-indigo-50 border-b border-indigo-100 p-2.5 flex items-start space-x-2 text-xs text-indigo-900 font-medium">
          <span className="text-sm">💡</span>
          <div className="flex-1">
            <span>{starterPrompt}</span>
            <button
              onClick={() => onSendMessage(starterPrompt.replace(/.*Try asking:\s*/, '').replace(/"/g, ''))}
              className="ml-2 underline font-bold text-indigo-700 hover:text-indigo-900"
            >
              Use prompt
            </button>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me' || msg.senderName === 'Ajay';

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs sm:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.type === 'GAME_CARD' ? (
                  <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 rounded-2xl shadow-lg border border-purple-500/30 my-2">
                    <div className="flex items-center space-x-2 mb-2 text-pink-300 font-bold text-xs">
                      <Gamepad2 className="w-4 h-4" />
                      <span>{msg.metadata?.gameType?.replace(/_/g, ' ') || 'Icebreaker Game'}</span>
                    </div>
                    <p className="text-sm font-semibold mb-3">{msg.metadata?.question}</p>

                    {msg.metadata?.options && (
                      <div className="space-y-2">
                        {msg.metadata.options.map((opt: string) => {
                          const isSelected = selectedGameChoice[msg.id] === opt;

                          return (
                            <button
                              key={opt}
                              onClick={() => handleGameSelect(msg.id, opt)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition border ${
                                isSelected
                                  ? 'bg-pink-500 text-white border-pink-400 shadow-md'
                                  : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/10'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{opt}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium shadow-sm leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                )}
                <span className="text-[10px] text-slate-400 px-1 mt-1 block">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-Chat Game Launcher Buttons */}
      <div className="bg-slate-100/90 border-t border-slate-200 p-2 flex items-center justify-around text-xs">
        <span className="font-bold text-slate-500 flex items-center space-x-1 text-[11px]">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Launch Game:</span>
        </span>
        <button
          onClick={() => onLaunchGame('WOULD_YOU_RATHER')}
          className="bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
        >
          🤔 Would You Rather
        </button>
        <button
          onClick={() => onLaunchGame('THIS_OR_THAT')}
          className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
        >
          ⚖️ This or That
        </button>
        <button
          onClick={() => onLaunchGame('TWO_TRUTHS')}
          className="bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
        >
          🕵️ Two Truths & Lie
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
