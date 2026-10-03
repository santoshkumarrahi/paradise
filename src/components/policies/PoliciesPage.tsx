import React, { useState } from 'react';
import {
  FileText,
  Clock,
  AlertOctagon,
  ShieldCheck,
  CreditCard,
  UserX,
  Volume2,
  Trash2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

export const PoliciesPage: React.FC = () => {
  const { policies, timings } = useHostel();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Policies' },
    { id: 'Check-in/out', label: 'Check-in & Registration' },
    { id: 'Payment', label: 'Payments & Deposits' },
    { id: 'Visitors', label: 'Visitors & Guests' },
    { id: 'Noise', label: 'Quiet Hours' },
    { id: 'Cleanliness', label: 'Cleanliness & Property' },
    { id: 'Prohibited', label: 'Zero Tolerance Rules' },
  ];

  const filtered = activeCategory === 'all'
    ? policies
    : policies.filter((p) => p.category === activeCategory);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-3.5 py-1.5 rounded-full">
            Rules, Regulations & Timings
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Hostel Policies & Code of Conduct
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            To ensure safety, academic discipline, and mutual respect, all residents agree to observe these official policies upon registration.
          </p>
        </div>

        {/* SECTION 39: HOSTEL TIMINGS GRID */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Daily Schedule</span>
              <h2 className="text-2xl font-extrabold">Official Hostel Operating Timings</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Timings enforced strictly by Warden and Security</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Check-in Window:</span>
              <p className="font-bold text-white text-sm mt-1">{timings.checkIn}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Check-out Hours:</span>
              <p className="font-bold text-white text-sm mt-1">{timings.checkOut}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Visitor Timings:</span>
              <p className="font-bold text-amber-400 text-sm mt-1">{timings.visitorHours}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Quiet Hours:</span>
              <p className="font-bold text-sky-400 text-sm mt-1">{timings.quietHours}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Reception Desk:</span>
              <p className="font-bold text-emerald-400 text-sm mt-1">{timings.receptionHours}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Breakfast:</span>
              <p className="font-bold text-white text-sm mt-1">{timings.breakfastHours}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Lunch:</span>
              <p className="font-bold text-white text-sm mt-1">{timings.lunchHours}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Dinner:</span>
              <p className="font-bold text-white text-sm mt-1">{timings.dinnerHours}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Janitorial Cleaning:</span>
              <p className="font-bold text-white text-sm mt-1">{timings.cleaningHours}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Management Office:</span>
              <p className="font-bold text-white text-sm mt-1">{timings.managementHours}</p>
            </div>
          </div>
        </div>

        {/* SECTION 38: POLICIES BREAKDOWN */}
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeCategory === c.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Policy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.category === 'Prohibited' && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Zero Tolerance</span>
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600">
                  {item.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                  {item.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
