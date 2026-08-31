'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Camera, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'INTRO' | 'CAMERA' | 'PROCESSING' | 'SUCCESS'>('INTRO');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartScan = async () => {
    setStep('CAMERA');
  };

  const handleCaptureSelfie = async () => {
    setStep('PROCESSING');
    setLoading(true);
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/verification/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selfieBase64: 'mock_selfie_data' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTimeout(() => {
          setStep('SUCCESS');
          setLoading(false);
          onSuccess();
        }, 1600);
      } else {
        alert(data.error || 'Verification failed');
        setStep('INTRO');
        setLoading(false);
      }
    } catch (err: any) {
      alert(err.message || 'Verification error');
      setStep('INTRO');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center space-y-5">
          {step === 'INTRO' && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">Verify Your Profile</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Verified profiles build trust & receive the exclusive <strong className="text-emerald-400">✓ Verified Badge</strong> across discovery, meetups & communities.
                </p>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Quick 10-second Liveness check
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Raw biometric data is never stored
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Must match account identity
                </div>
              </div>

              <button
                onClick={handleStartScan}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-4 h-4" /> Start Face Verification
              </button>
            </div>
          )}

          {step === 'CAMERA' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Center your face in the frame</h3>
              <p className="text-xs text-slate-400">Ensure good lighting and look directly into the camera</p>

              {/* Simulated Camera Viewfinder */}
              <div className="w-56 h-56 mx-auto rounded-full border-4 border-dashed border-emerald-500/60 p-2 flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
                <div className="w-full h-full rounded-full bg-slate-900/80 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>
              </div>

              <button
                onClick={handleCaptureSelfie}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition"
              >
                Take Selfie & Verify Liveness
              </button>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="py-12 space-y-4">
              <Sparkles className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white">Validating Liveness & Face Match...</h3>
              <p className="text-xs text-slate-400">Communicating with third-party verification provider...</p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white">Profile Verified!</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Congratulations! Your account now displays the <span className="text-emerald-400 font-bold">✓ Verified</span> badge.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
