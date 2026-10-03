import React from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { Complaint, PoliceEscalationStatus } from '../../types';

interface ComplaintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  isOpen,
  onClose,
  complaint,
}) => {
  const { config } = useHostel();

  if (!isOpen || !complaint) return null;

  const police = config.policeConfig;
  const isPoliceEscalated = !!complaint.policeReferenceNumber;

  const getSeverityBadge = (sev: Complaint['severity']) => {
    switch (sev) {
      case 'Emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'Serious': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusBadge = (st: Complaint['status']) => {
    switch (st) {
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Escalated to Police':
        return 'bg-purple-100 text-purple-800 font-bold';
      case 'In Progress':
        return 'bg-sky-100 text-sky-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Bar */}
        <div className={`p-6 text-white flex items-center justify-between ${
          complaint.severity === 'Emergency'
            ? 'bg-red-950'
            : isPoliceEscalated
            ? 'bg-slate-950'
            : 'bg-slate-900'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Complaint ID: {complaint.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(complaint.severity)}`}>
                {complaint.severity}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Category: {complaint.category}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Status & Confidentiality Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Investigation Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${getStatusBadge(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            {complaint.isConfidential && (
              <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
                🔒 Confidential Filing
              </span>
            )}
          </div>

          {/* SECTION 30: OFFICIAL POLICE ESCALATION TRACKING */}
          {isPoliceEscalated && (
            <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Official Law Enforcement Transmission (Section 30)</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-[11px]">
                  VERIFIED INTEGRATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Official Police Reference #:</span>
                  <p className="font-mono font-bold text-indigo-950 text-sm mt-0.5">
                    {complaint.policeReferenceNumber}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Assigned Police Station:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {complaint.policeStation || police.policeStation}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Jurisdiction:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {complaint.policeJurisdiction || `${police.city}, ${police.district}`}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Authority Tracking Status:</span>
                  <p className="font-bold text-indigo-700 mt-0.5">
                    {complaint.policeStatus || 'Submitted'}
                  </p>
                </div>
              </div>

              {complaint.policeFeedbackNotes && (
                <div className="p-3 rounded-xl bg-white border border-indigo-100 text-xs text-slate-700">
                  <p className="font-semibold text-indigo-900 mb-1">Official Station Remarks / Progress:</p>
                  <p>{complaint.policeFeedbackNotes}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-xs text-indigo-900 pt-1">
                <span>Official Helpline: <strong>{police.officialPolicePhone}</strong></span>
                <a
                  href={police.officialComplaintPortal}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
                >
                  <span>Verify on Police Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Details & Location */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">Complainant:</span>
              <p className="font-bold text-slate-900 mt-0.5">{complaint.studentName}</p>
            </div>
            <div>
              <span className="text-slate-500">Room Number:</span>
              <p className="font-bold text-slate-900 mt-0.5">{complaint.roomNumber}</p>
            </div>
            <div>
              <span className="text-slate-500">Incident Date:</span>
              <p className="font-bold text-slate-900 mt-0.5">{complaint.incidentDate}</p>
            </div>
            <div>
              <span className="text-slate-500">Filed On:</span>
              <p className="font-bold text-slate-900 mt-0.5">{new Date(complaint.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Reported Particulars</h4>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
              {complaint.description}
            </div>
          </div>

          {/* Evidence Attachments */}
          {complaint.evidenceFiles && complaint.evidenceFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Attached Evidence Files</h4>
              <div className="flex flex-wrap gap-2">
                {complaint.evidenceFiles.map((f, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{f.name}</span>
                    <span className="text-slate-400">({f.size || 'Attached'})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Management Notes */}
          {complaint.adminNotes && (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Hostel Management Action Notes</h4>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed">
                <p>{complaint.adminNotes}</p>
                {complaint.assignedStaff && (
                  <p className="mt-1 font-semibold text-emerald-800">
                    Assigned Officer: {complaint.assignedStaff}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
