import React from 'react';
import { ShieldAlert, Phone, Ambulance, Flame, MessageSquare, AlertTriangle } from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

interface EmergencyBannerProps {
  onOpenComplaint?: () => void;
  compact?: boolean;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onOpenComplaint, compact }) => {
  const { config } = useHostel();
  const police = config.policeConfig;

  if (compact) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🚨 24/7 Law Enforcement & Emergency Help</span>
            </h4>
            <p className="text-xs text-red-700">
              Jurisdiction: {police.policeStation} • Helpline: 15
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:15"
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 15 (Police)</span>
          </a>
          <a
            href="tel:1122"
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Call 1122</span>
          </a>
          <a
            href={`tel:${police.hostelEmergencyPhone}`}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Warden On-Call</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900 via-rose-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-red-800/40">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            🚨 EMERGENCY CONTACT & SAFETY DESK
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">
            Need Immediate Police or Medical Assistance?
          </h3>
          <p className="text-red-200 text-xs sm:text-sm leading-relaxed">
            For physical threats, major theft, assault, or medical emergencies, contact government authorities directly or trigger immediate on-call hostel intervention.
          </p>
          <p className="text-[11px] text-slate-300">
            Registered Jurisdiction: <span className="font-semibold text-white">{police.policeStation}</span> ({police.city}, {police.province})
          </p>
        </div>

        {/* Quick Emergency Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
          <a
            href="tel:15"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition hover:scale-102"
          >
            <ShieldAlert className="w-5 h-5 mb-1" />
            <span>Call Police</span>
            <span className="text-[10px] font-normal opacity-90">Rescue 15</span>
          </a>

          <a
            href="tel:1122"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-black/20 transition hover:scale-102"
          >
            <Ambulance className="w-5 h-5 mb-1" />
            <span>Ambulance</span>
            <span className="text-[10px] font-normal opacity-90">Rescue 1122</span>
          </a>

          <a
            href={`tel:${police.hostelEmergencyPhone}`}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-lg border border-slate-700 transition hover:scale-102"
          >
            <Phone className="w-5 h-5 mb-1 text-amber-400" />
            <span>Hostel Warden</span>
            <span className="text-[10px] font-normal opacity-90">{police.hostelManagerPhone}</span>
          </a>

          <a
            href={`tel:${police.hostelSecurityPhone}`}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-lg border border-slate-700 transition hover:scale-102"
          >
            <Phone className="w-5 h-5 mb-1 text-sky-400" />
            <span>Security Head</span>
            <span className="text-[10px] font-normal opacity-90">{police.hostelSecuritySupervisor.split(' ')[0]}</span>
          </a>
        </div>
      </div>

      {onOpenComplaint && (
        <div className="mt-4 pt-4 border-t border-red-800/40 flex flex-wrap items-center justify-between text-xs gap-3">
          <span className="text-red-200">
            For non-immediate incidents, you can record a formal encrypted complaint:
          </span>
          <button
            onClick={onOpenComplaint}
            className="px-4 py-2 rounded-xl bg-white text-red-950 font-bold hover:bg-red-50 transition cursor-pointer"
          >
            Submit Incident / Serious Complaint
          </button>
        </div>
      )}
    </div>
  );
};

export const StickyMobileBar: React.FC<{
  onOpenBooking: () => void;
  onOpenComplaint: () => void;
  onNavigate: (tab: string) => void;
}> = ({ onOpenBooking, onOpenComplaint, onNavigate }) => {
  const { config } = useHostel();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 shadow-lg xl:hidden flex items-center justify-between gap-1.5 text-xs">
      <button
        onClick={onOpenBooking}
        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-center shadow-md shadow-emerald-700/20 active:scale-95 transition"
      >
        Book Room
      </button>

      <a
        href={`tel:${config.phone}`}
        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1 active:scale-95 transition"
      >
        <Phone className="w-4 h-4 text-emerald-600" />
        <span className="hidden xs:inline">Call</span>
      </a>

      <a
        href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className="px-3 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 active:scale-95 transition"
      >
        <MessageSquare className="w-4 h-4 text-emerald-600" />
        <span className="hidden xs:inline">WhatsApp</span>
      </a>

      <button
        onClick={onOpenComplaint}
        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95 transition"
      >
        Complaint
      </button>

      <button
        onClick={() => onNavigate('emergency')}
        className="px-2.5 py-2.5 rounded-xl bg-red-600 text-white font-bold flex items-center gap-1 active:scale-95 transition"
        title="Emergency"
      >
        <ShieldAlert className="w-4 h-4" />
      </button>
    </div>
  );
};
