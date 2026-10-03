import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

interface AboutSectionProps {
  onOpenBooking: () => void;
  onViewPolicies: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking, onViewPolicies }) => {
  const { config } = useHostel();

  return (
    <section id="about-section" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photos Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/5] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                  alt="Hostel Building and secure entrance"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>24/7 Monitored Campus</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Biometric access, 32 CCTV cameras, registered visitor logs and active warden presence.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Approved & Verified</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Regulated accommodation with direct liaison to local police and emergency rescue 1122.
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/5] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                  alt="Student room and study environment"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Text Content: Fully driven by editable config */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                About Our Hostel
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                {config.name}
              </h2>
              <p className="text-emerald-700 font-semibold text-sm mt-1">
                {config.tagline}
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {config.aboutIntro}
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Student Environment</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {config.aboutEnvironment}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safety & Security</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {config.aboutSafety}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Hygiene & Cleanliness</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {config.aboutCleanliness}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Hostel Management</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {config.aboutManagement}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 active:scale-98 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Reserve Room Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewPolicies}
                className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition cursor-pointer"
              >
                <span>View Hostel Policies & Rules</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
