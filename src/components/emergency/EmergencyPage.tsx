import React from 'react';
import {
  ShieldAlert,
  Phone,
  Ambulance,
  Flame,
  MessageSquare,
  AlertTriangle,
  Building,
  User,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Clock,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

interface EmergencyPageProps {
  onOpenComplaint: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onOpenComplaint }) => {
  const { config } = useHostel();
  const police = config.policeConfig;

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Main Emergency Alert Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-red-900/50 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            🚨 24/7 Rapid Emergency Response & Law Enforcement Assistance
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Emergency Contacts & Police Jurisdictions
          </h1>

          <p className="text-red-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            If you or any resident is facing an immediate threat to physical safety, harassment, burglary, medical distress, or fire, act immediately using the verified Pakistani hotlines below.
          </p>

          {/* Quick Dial Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <a
              href="tel:15"
              className="p-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-950/50 transition hover:scale-102"
            >
              <ShieldAlert className="w-8 h-8 mb-1" />
              <span className="text-lg">Rescue 15</span>
              <span className="text-xs font-normal opacity-90">Pakistan Police Helpline</span>
            </a>

            <a
              href="tel:1122"
              className="p-5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-950/40 transition hover:scale-102"
            >
              <Ambulance className="w-8 h-8 mb-1" />
              <span className="text-lg">Rescue 1122</span>
              <span className="text-xs font-normal opacity-90">Medical & Ambulance Service</span>
            </a>

            <a
              href={`tel:${police.hostelEmergencyPhone}`}
              className="p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm flex flex-col items-center justify-center gap-1 shadow-lg border border-slate-700 transition hover:scale-102"
            >
              <Phone className="w-8 h-8 mb-1 text-amber-400" />
              <span className="text-base truncate max-w-[200px]">Hostel Warden</span>
              <span className="text-xs font-normal text-slate-300">{police.hostelManagerPhone}</span>
            </a>

            <a
              href={`tel:${police.hostelSecurityPhone}`}
              className="p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm flex flex-col items-center justify-center gap-1 shadow-lg border border-slate-700 transition hover:scale-102"
            >
              <Phone className="w-8 h-8 mb-1 text-sky-400" />
              <span className="text-base truncate max-w-[200px]">Security Incharge</span>
              <span className="text-xs font-normal text-slate-300">{police.hostelSecuritySupervisor}</span>
            </a>
          </div>
        </div>

        {/* SECTION 28 & 42: CITY-BASED POLICE ROUTING SPECIFICATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Registered Police Station Card */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Designated Law Enforcement Agency</span>
                <h3 className="text-xl font-bold text-slate-900">{police.policeStation}</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Based on the hostel's verified geographical address in {police.district}, all official incidents requiring police escalation are mapped to this station.
            </p>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm pt-2">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Police Station:</span>
                <strong className="text-slate-900">{police.policeStation}</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Station Direct Phone:</span>
                <a href={`tel:${police.stationDirectPhone}`} className="font-bold text-red-600 hover:underline">{police.stationDirectPhone}</a>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">City & District:</span>
                <span className="font-semibold text-slate-800">{police.city}, {police.district}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Province & Country:</span>
                <span className="font-semibold text-slate-800">{police.province}, {police.country}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Electronic Integration API:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" /> {police.apiStatus}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={police.officialComplaintPortal}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>Visit {police.portalName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenComplaint}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Submit Incident for Law Enforcement Escalation
              </button>
            </div>
          </div>

          {/* Internal Hostel Emergency Team Card */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Internal Response Protocol</span>
                <h3 className="text-xl font-bold text-slate-900">Hostel Safety & Warden Desk</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our on-site warden and security team are available on premises 24/7. Physical security checkpoints monitor entrance gates at all hours.
            </p>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm pt-2">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Hostel Manager:</span>
                <strong className="text-slate-900">{police.hostelManagerName}</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Manager Direct Line:</span>
                <a href={`tel:${police.hostelManagerPhone}`} className="font-bold text-emerald-700 hover:underline">{police.hostelManagerPhone}</a>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Security Supervisor:</span>
                <strong className="text-slate-900">{police.hostelSecuritySupervisor}</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Gate Security Intercom:</span>
                <a href={`tel:${police.hostelSecurityPhone}`} className="font-bold text-slate-800 hover:underline">{police.hostelSecurityPhone}</a>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Citizen Police (CPLC):</span>
                <a href="tel:1102" className="font-bold text-sky-700 hover:underline">{police.cplcHelpline}</a>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Hostel boundary sensor alarms and CCTV servers are securely locked in the warden control room with secondary UPS battery backups.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
