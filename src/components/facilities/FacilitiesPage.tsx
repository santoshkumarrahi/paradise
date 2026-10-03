import React, { useState } from 'react';
import {
  Zap,
  Wifi,
  Droplets,
  Sparkles,
  Shirt,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Flame,
  Snowflake,
  AlertTriangle,
  Car,
  BookOpen,
  Info,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { Facility } from '../../types';

export const FacilitiesPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { facilities, config } = useHostel();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Power', 'Connectivity', 'Hygiene', 'Living', 'Security', 'Convenience'];

  const filtered = activeCategory === 'All'
    ? facilities.filter((f) => f.isEnabled)
    : facilities.filter((f) => f.isEnabled && f.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'wifi': return <Wifi className="w-6 h-6 text-sky-500" />;
      case 'droplets': return <Droplets className="w-6 h-6 text-teal-500" />;
      case 'snowflake': return <Snowflake className="w-6 h-6 text-cyan-500" />;
      case 'sparkles': return <Sparkles className="w-6 h-6 text-indigo-500" />;
      case 'shirt': return <Shirt className="w-6 h-6 text-blue-500" />;
      case 'utensils': return <Utensils className="w-6 h-6 text-orange-500" />;
      case 'shieldcheck': return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'alerttriangle': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'flame': return <Flame className="w-6 h-6 text-rose-500" />;
      case 'car': return <Car className="w-6 h-6 text-slate-600" />;
      case 'bookopen': return <BookOpen className="w-6 h-6 text-violet-500" />;
      default: return <Sparkles className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Hostel Amenities & Living Standards
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Hostel Facilities & Infrastructure
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            All listed facilities are verified and operational on premises. Free vs paid services are transparently marked.
          </p>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeCategory === cat
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((facility) => (
            <div
              key={facility.id}
              className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  {getIcon(facility.icon)}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    facility.isFree
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {facility.isFree ? 'Free Included' : (facility.priceNote || 'Optional Service')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{facility.name}</h3>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{facility.category}</span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DEDICATED SECTIONS (Section 11, 12, 13, 14, 15) */}
        <div className="space-y-12 pt-8">
          {/* Section 11: 24-HOUR ELECTRICITY */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-50 p-6 sm:p-10 border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Uninterrupted Power</span>
                <h2 className="text-2xl font-extrabold text-slate-900">24-Hour Electricity Available</h2>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
              We understand that exams and remote work cannot pause during municipal load-shedding. Our facility is equipped with automated tri-source power generation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Backup Systems</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.electricityBackupType}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Transfer Duration</span>
                <p className="font-bold text-emerald-700 text-sm mt-1">{config.electricityBackupDuration}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.electricityStatus}</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/80 border border-amber-200/40 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Electricity Policy:</strong> {config.electricityPolicy}</span>
            </div>
          </div>

          {/* Section 12: WIFI */}
          <div className="rounded-3xl bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-slate-50 p-6 sm:p-10 border border-sky-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">High Speed Connectivity</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Fast & Reliable Wi-Fi</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white border border-sky-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Package & Speed</span>
                <p className="font-bold text-slate-900 text-base mt-1">{config.wifiSpeed}</p>
                <p className="text-xs text-slate-500 mt-1">Dual-band 2.4GHz and 5GHz mesh nodes.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-sky-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Coverage</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.wifiCoverage}</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/80 border border-sky-200/40 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>Usage Rules:</strong> {config.wifiUsageRules}</span>
            </div>
          </div>

          {/* Section 13: WATER */}
          <div className="rounded-3xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-slate-50 p-6 sm:p-10 border border-teal-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">Hydration & Hygiene</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Clean Drinking Water & Supply</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white border border-teal-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">RO Purification</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.waterCleanliness}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-teal-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Water Coolers</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.waterCoolerLocations}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-teal-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">General Water Supply</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.waterSupplyType}</p>
              </div>
            </div>
          </div>

          {/* Section 14: CLEANLINESS */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-50 p-6 sm:p-10 border border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Daily Janitorial Service</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Cleanliness & Hygiene Schedule</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white border border-indigo-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Cleaning Timings</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.cleanlinessSchedule}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-indigo-200/60 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Waste Management</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{config.wasteManagement}</p>
              </div>
            </div>
          </div>

          {/* Section 15: IRON & CLOTHES FACILITY */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-slate-50 p-6 sm:p-10 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Wardrobe Care</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Iron & Laundry Facility</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white border border-blue-200/60 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Ironing Stations</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm mt-2">{config.ironFacilityDescription}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-blue-200/60 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Laundry Service</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">COMMERCIAL</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm mt-2">{config.laundryServiceDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onOpenBooking}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-700/20 active:scale-98 transition cursor-pointer"
          >
            Book a Room with These Facilities
          </button>
        </div>
      </div>
    </div>
  );
};
