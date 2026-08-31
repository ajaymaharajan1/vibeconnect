'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Users, TrendingUp, AlertTriangle, Ban, CheckCircle2, Search, BarChart3, ShieldCheck } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'reports'>('analytics');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
      fetchReports();
      fetchUsers();
    }
  }, [isOpen]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch(`http://127.0.0.1:5000/api/admin/users?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/admin/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          isBanned,
          reason: 'Violation of VibeConnect Community Guidelines',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.message || 'Ban action failed');
    }
  };

  const handleResolveReport = async (reportId: string, status: 'ACTION_TAKEN' | 'DISMISSED') => {
    try {
      const token = localStorage.getItem('vibeconnect_token');
      const res = await fetch('http://127.0.0.1:5000/api/admin/reports/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId, status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchReports();
      }
    } catch (err: any) {
      alert(err.message || 'Resolution failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600/20 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">VibeConnect Admin Panel</h2>
              <p className="text-xs text-slate-400">Platform Analytics, User Moderation & Content Reports</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics & Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> User Moderation ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Pending Reports ({reports.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Daily Active (DAU)</span>
                  <span className="text-2xl font-black text-violet-400">{analytics.dau}</span>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Monthly Active (MAU)</span>
                  <span className="text-2xl font-black text-cyan-400">{analytics.mau}</span>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Retention Rate</span>
                  <span className="text-2xl font-black text-emerald-400">{analytics.retentionRate}</span>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Meetup Attendance</span>
                  <span className="text-2xl font-black text-amber-400">{analytics.meetupAttendanceRate}</span>
                </div>
              </div>

              <div className="p-5 bg-slate-800/20 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Operational Health</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Registered Users</span>
                    <span className="text-white font-bold">{analytics.totalUsers}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mutual Connections</span>
                    <span className="text-white font-bold">{analytics.totalMutualConnections}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Active Meetups</span>
                    <span className="text-white font-bold">{analytics.totalMeetups}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USER MODERATION TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name, email, or city..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <button
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-500"
                >
                  Search
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30">
                        <td className="p-3 text-white font-semibold">{u.name}</td>
                        <td className="p-3 text-slate-400">{u.email}</td>
                        <td className="p-3 text-slate-300">{u.city}</td>
                        <td className="p-3">
                          {u.isBanned ? (
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full font-bold text-[10px]">
                              BANNED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                              ACTIVE
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {u.isBanned ? (
                            <button
                              onClick={() => handleBanUser(u.id, false)}
                              className="px-3 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold text-[10px] hover:bg-emerald-600/30"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBanUser(u.id, true)}
                              className="px-3 py-1 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-lg font-bold text-[10px] hover:bg-rose-600/30"
                            >
                              Suspend / Ban
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No pending community or post reports!
                </div>
              ) : (
                reports.map((r) => (
                  <div key={r.id} className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-bold">
                          {r.targetType} REPORT
                        </span>
                        <span className="text-xs text-slate-400">by {r.reporter?.name}</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">Reason: {r.reason}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveReport(r.id, 'ACTION_TAKEN')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
                      >
                        Take Action (Ban/Delete)
                      </button>
                      <button
                        onClick={() => handleResolveReport(r.id, 'DISMISSED')}
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
