import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Lock,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { Complaint } from '../../types';

interface ComplaintsPageProps {
  onOpenComplaintForm: () => void;
  onViewComplaintDetails: (complaint: Complaint) => void;
}

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  onOpenComplaintForm,
  onViewComplaintDetails,
}) => {
  const { config, complaints } = useHostel();
  const { currentUser } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);

  const police = config.policeConfig;

  // Filter complaints for current logged-in user
  const userComplaints = complaints.filter(
    (c) => c.userId === currentUser?.id || c.studentName === currentUser?.name
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = complaints.find(
      (c) => c.id.toLowerCase() === searchId.trim().toLowerCase() || c.policeReferenceNumber?.toLowerCase() === searchId.trim().toLowerCase()
    );
    setSearchedComplaint(found || null);
    setSearched(true);
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
            Hostel Grievance & Police Escalation Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Hostel Complaints & Incident Reporting
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Report maintenance issues, noise disturbances, harassment, or serious incidents. We guarantee swift action, full privacy, and direct law enforcement routing where required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenComplaintForm}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-lg transition active:scale-98 cursor-pointer"
            >
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>Submit a Formal Complaint</span>
            </button>

            <a
              href="tel:15"
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-950/20 transition active:scale-98"
            >
              <Phone className="w-5 h-5" />
              <span>Immediate Emergency (Call 15)</span>
            </a>
          </div>
        </div>

        {/* TRACK COMPLAINT BY ID SEARCH BAR */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Track Complaint or Police Reference Status</span>
          </h3>
          <p className="text-xs text-slate-500">
            Enter your unique Complaint ID (e.g. CMP-9041) or Official Police Reference # (e.g. ICT-POL-2026-99341).
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter CMP-XXXX or ICT-POL-XXXX"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs font-mono uppercase focus:border-emerald-600 text-slate-900"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition cursor-pointer"
            >
              Track Status
            </button>
          </form>

          {searched && (
            <div className="pt-2">
              {searchedComplaint ? (
                <div
                  onClick={() => onViewComplaintDetails(searchedComplaint)}
                  className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-emerald-900">{searchedComplaint.id}</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{searchedComplaint.category}</p>
                    <p className="text-slate-600 line-clamp-1">{searchedComplaint.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-white border border-emerald-200 text-emerald-800 text-[11px]">
                      {searchedComplaint.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Click to view details →</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-red-600 font-semibold">
                  No complaint record found matching "{searchId}". Please check your Reference ID.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 3 TIER SYSTEM EXPLANATION (SECTIONS 25, 26, 27) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Normal */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Normal Complaint</h3>
            <p className="text-xs text-slate-500">
              Wi-Fi connectivity, room cleaning, plumbing repairs, mess food complaints, and general hostel maintenance.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
              <span className="font-semibold block text-slate-900">Routing & Turnaround:</span>
              <span>Goes directly to Hostel Management. Resolved within 24 hours.</span>
            </div>
          </div>

          {/* Serious */}
          <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Serious Complaint</h3>
            <p className="text-xs text-slate-500">
              Repeated harassment, verbal threats, property theft, security gate lapses, or serious staff misconduct.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-amber-900">
              <span className="font-semibold block">Priority Escalation:</span>
              <span>Marked for immediate warden review with student option for legal police escalation.</span>
            </div>
          </div>

          {/* Emergency / Police */}
          <div className="p-6 rounded-3xl bg-white border border-red-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Emergency / Police Matter</h3>
            <p className="text-xs text-slate-500">
              Physical violence, life threats, sexual assault/abuse, major burglary, or kidnapping/missing person.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-red-900">
              <span className="font-semibold block">Official Police Jurisdiction:</span>
              <span>Dispatches official complaint to {police.policeStation} via authorized citizen portal.</span>
            </div>
          </div>
        </div>

        {/* POLICE INTEGRATION DETAILS (SECTION 28 & 29) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Official Law Enforcement Routing (Section 28)
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Mapped Police Station: {police.policeStation}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Official Electronic Gateway Active
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            When serious or emergency complaints require escalation, the system formats verified evidence and reports to {police.policeStation} in {police.district}. An official police reference number is tracked right inside your resident dashboard.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
            <span>Direct Station Hotline: <strong className="text-white">{police.stationDirectPhone}</strong></span>
            <span>•</span>
            <span>Emergency Police: <strong className="text-red-400">15</strong></span>
            <span>•</span>
            <span>Portal: <a href={police.officialComplaintPortal} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">{police.portalName}</a></span>
          </div>
        </div>
      </div>
    </div>
  );
};
