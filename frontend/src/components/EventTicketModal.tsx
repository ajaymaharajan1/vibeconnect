'use client';

import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, Ticket, ShieldCheck, Sparkles, MapPin, Calendar } from 'lucide-react';

interface EventTicketModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EventTicketModal: React.FC<EventTicketModalProps> = ({ event, isOpen, onClose }) => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleRegister = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event.id, paidAmount: event.price || 0 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTicket(data.ticket);
      } else {
        alert(data.error || 'Failed to register');
      }
    } catch (err: any) {
      alert(err.message || 'Error registering for event');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateOrganizerScan = async () => {
    if (!ticket) return;
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/events/verify-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrCodeString: ticket.qrCode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScanResult(data.message);
        setTicket({ ...ticket, status: 'CHECKED_IN' });
      } else {
        alert(data.error || 'QR Scan Failed');
      }
    } catch (err: any) {
      alert(err.message || 'Scan error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-600/20 text-violet-400 rounded-2xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{event.title}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-violet-400" /> {event.venueName || 'Chennai'}
              </p>
            </div>
          </div>

          {!ticket ? (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Date & Time:</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> {event.date || 'Upcoming'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Entry Ticket Price:</span>
                  <span className="text-emerald-400 font-bold">
                    {event.price > 0 ? `₹${event.price}` : 'FREE Entry'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Issuing Pass...' : 'Get Event Pass & Generate QR Ticket'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-5 bg-white text-slate-900 rounded-3xl space-y-3 shadow-inner">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  VibeConnect Official QR Event Pass
                </span>
                
                {/* Simulated QR Visual */}
                <div className="w-44 h-44 mx-auto border-4 border-slate-900 rounded-2xl p-2 flex flex-col items-center justify-center bg-slate-100">
                  <QrCode className="w-32 h-32 text-slate-900" />
                  <span className="text-[10px] font-mono text-slate-600 mt-1">
                    VERIFIED PASS
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  Status:{' '}
                  <span
                    className={`font-bold ${
                      ticket.status === 'CHECKED_IN' ? 'text-emerald-600' : 'text-violet-600'
                    }`}
                  >
                    {ticket.status === 'CHECKED_IN' ? '✅ CHECKED-IN' : '🎟️ ACTIVE PASS'}
                  </span>
                </div>
              </div>

              {scanResult && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {scanResult}
                </div>
              )}

              <button
                onClick={handleSimulateOrganizerScan}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
              >
                🔍 Simulate Organizer QR Scanner Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
