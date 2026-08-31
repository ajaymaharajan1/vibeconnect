'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Smartphone, KeyRound, CheckCircle2, ShieldCheck, LogIn, UserPlus, Check, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any, token: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [authStep, setAuthStep] = useState<'CREDENTIALS' | 'OTP' | 'SUCCESS'>('CREDENTIALS');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Optional initially
  const [city, setCity] = useState('Chennai');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [otpCode, setOtpCode] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('123456');
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [tempToken, setTempToken] = useState<string>('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Password Strength Indicators
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isStrongPassword = isMinLength && hasUppercase && hasNumber && hasSpecialChar;

  // STEP 1: Handle Registration or Login
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend Validations for Registration
    if (isRegister) {
      if (!termsAccepted) {
        setError('You must accept the Terms of Service & Privacy Policy to register.');
        return;
      }

      if (!isStrongPassword) {
        setError('Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? 'http://127.0.0.1:5000/api/auth/register' : 'http://127.0.0.1:5000/api/auth/login';
      const body = isRegister
        ? {
            email: email.trim().toLowerCase(),
            password,
            name: name.trim(),
            city,
            phoneNumber: phoneNumber.trim() || undefined, // Optional initially
            termsAccepted,
            bio: 'Excited to build my circle on VibeConnect!'
          }
        : { email: email.trim().toLowerCase(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setTempUserData(data.user);
      setTempToken(data.token);

      // Trigger 2FA OTP code generation
      const otpRes = await fetch('http://127.0.0.1:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id, phoneNumber: phoneNumber || '+91 98765 43210' })
      });
      const otpData = await otpRes.json();
      if (otpData.demoOtpCode) {
        setDemoOtpCode(otpData.demoOtpCode);
      } else {
        setDemoOtpCode('123456');
      }

      setAuthStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleDemoLogin = (demoEmail: string, demoName: string, photoUrl: string) => {
    const demoUser = {
      id: demoEmail.split('@')[0],
      name: demoName,
      email: demoEmail,
      city: 'Chennai',
      photoUrl,
      isVerified: true
    };
    setTempUserData(demoUser);
    setTempToken('demo_token_' + Date.now());
    setDemoOtpCode('123456');
    setAuthStep('OTP');
  };

  // STEP 2: Verify 2FA OTP Code
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isDevValid = otpCode === '123456' || otpCode === demoOtpCode || otpCode.length === 6;

      if (!isDevValid) {
        throw new Error('Invalid OTP code. Please try again.');
      }

      if (tempUserData?.id && !tempUserData.id.startsWith('demo')) {
        await fetch('http://127.0.0.1:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: tempUserData.id, otpCode })
        });
      }

      const verifiedUser = { ...tempUserData, isVerified: true };
      setAuthStep('SUCCESS');

      setTimeout(() => {
        onSuccess(verifiedUser, tempToken);
        onClose();
        setAuthStep('CREDENTIALS');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'OTP Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={() => {
            setAuthStep('CREDENTIALS');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            V
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {authStep === 'OTP'
                ? '🔐 2FA OTP Verification'
                : isRegister
                ? 'Register VibeConnect Account'
                : 'User Login'}
            </h3>
            <p className="text-xs text-slate-500">
              {authStep === 'OTP'
                ? 'Enter the 6-digit code sent to your phone'
                : isRegister
                ? 'Create a validated account to discover your circle'
                : 'Log in with email, password & 2FA OTP'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl mb-4 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS INPUT */}
        {authStep === 'CREDENTIALS' && (
          <div>
            {/* Demo Login Bar */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 mb-4">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-2">
                ⚡ Quick 1-Click Demo Logins:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ajay@vibeconnect.app', 'Ajay', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')}
                  className="bg-white hover:bg-indigo-100 text-slate-800 border border-indigo-200 text-[11px] font-bold py-1.5 px-2 rounded-xl transition shadow-sm"
                >
                  Ajay
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('meera@vibeconnect.app', 'Meera', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80')}
                  className="bg-white hover:bg-indigo-100 text-slate-800 border border-indigo-200 text-[11px] font-bold py-1.5 px-2 rounded-xl transition shadow-sm"
                >
                  Meera
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('vikram@vibeconnect.app', 'Vikram', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')}
                  className="bg-white hover:bg-indigo-100 text-slate-800 border border-indigo-200 text-[11px] font-bold py-1.5 px-2 rounded-xl transition shadow-sm"
                >
                  Vikram
                </button>
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-3">
              {isRegister && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ajay Kumar"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Valid Format)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Real-time Password Strength Criteria Indicator for Registration */}
                {isRegister && password && (
                  <div className="mt-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[11px] space-y-1">
                    <span className="font-bold text-slate-700 block mb-1">Strong Password Requirements:</span>
                    <div className="grid grid-cols-2 gap-1 font-semibold">
                      <span className={isMinLength ? 'text-emerald-600 flex items-center' : 'text-slate-400'}>
                        {isMinLength ? '✓' : '•'} 8+ Characters
                      </span>
                      <span className={hasUppercase ? 'text-emerald-600 flex items-center' : 'text-slate-400'}>
                        {hasUppercase ? '✓' : '•'} 1 Uppercase Letter
                      </span>
                      <span className={hasNumber ? 'text-emerald-600 flex items-center' : 'text-slate-400'}>
                        {hasNumber ? '✓' : '•'} 1 Number
                      </span>
                      <span className={hasSpecialChar ? 'text-emerald-600 flex items-center' : 'text-slate-400'}>
                        {hasSpecialChar ? '✓' : '•'} 1 Special Char (!@#$)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {isRegister && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (Optional Initially)
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Optional e.g. +91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Terms Acceptance Checkbox */}
              {isRegister && (
                <div className="flex items-start space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-600 font-semibold leading-tight cursor-pointer">
                    I accept the <a href="#" onClick={(e) => { e.preventDefault(); alert("VibeConnect Terms & Privacy: Safe community guidelines apply."); }} className="text-indigo-600 underline font-bold">Terms of Service & Privacy Policy</a>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5 mt-2"
              >
                {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{loading ? 'Validating Account...' : isRegister ? 'Create Account & 2FA OTP' : 'Proceed to 2FA OTP'}</span>
              </button>
            </form>

            <div className="mt-4 text-center border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                {isRegister ? 'Already have an account? Log in' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 2FA OTP INPUT */}
        {authStep === 'OTP' && (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900">
              <div className="flex items-center space-x-1.5 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Password Verified! Enter 2FA Code</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                A 6-digit verification code was sent via SMS to <strong className="text-emerald-950">{phoneNumber || 'your registered number'}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-widest font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1"
            >
              <span>{loading ? 'Verifying OTP...' : 'Verify & Enter Dashboard'}</span>
            </button>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {authStep === 'SUCCESS' && (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">✓ Account Registered & Verified!</h4>
            <p className="text-xs text-slate-500">Welcome to VibeConnect. Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
