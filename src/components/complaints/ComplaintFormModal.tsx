import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Upload,
  FileText,
  AlertCircle,
  Phone,
  EyeOff,
  Send,
  Building,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { ComplaintCategory, ComplaintSeverity, Complaint, EvidenceFile } from '../../types';

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplaintSubmitted: (complaint: Complaint) => void;
}

export const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({
  isOpen,
  onClose,
  onComplaintSubmitted,
}) => {
  const { config, submitComplaint } = useHostel();
  const { currentUser } = useAuth();

  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [studentPhone, setStudentPhone] = useState(currentUser?.phone || '');
  const [roomNumber, setRoomNumber] = useState(currentUser?.roomNumber || '201');
  const [category, setCategory] = useState<ComplaintCategory>('Wi-Fi');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [incidentLocation, setIncidentLocation] = useState('Room ' + (currentUser?.roomNumber || '201'));
  const [userIndicatedEmergency, setUserIndicatedEmergency] = useState(false);
  const [isConfidential, setIsConfidential] = useState(false);
  const [requestPoliceEscalation, setRequestPoliceEscalation] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const police = config.policeConfig;

  // Determine severity dynamically for immediate guidance
  const computeSeverity = (cat: ComplaintCategory, isEmergencyMarked: boolean): ComplaintSeverity => {
    if (
      isEmergencyMarked ||
      cat === 'Physical Violence' ||
      cat === 'Sexual Harassment/Abuse' ||
      cat === 'Threats' ||
      cat === 'Missing Person' ||
      cat === 'Emergency'
    ) {
      return 'Emergency';
    }
    if (cat === 'Theft' || cat === 'Harassment' || cat === 'Illegal Activity' || cat === 'Staff Behavior') {
      return 'Serious';
    }
    return 'Normal';
  };

  const currentSeverity = computeSeverity(category, userIndicatedEmergency);

  // Sample mock evidence attachments
  const handleAttachEvidence = (name: string, type: string) => {
    const file: EvidenceFile = {
      name,
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      type,
      size: '1.4 MB',
    };
    setEvidenceFiles((prev) => [...prev, file]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!description.trim() || description.length < 15) {
      setErrorMsg('Please describe the complaint clearly (at least 15 characters).');
      return;
    }

    try {
      setSubmitting(true);
      const created = await submitComplaint({
        userId: currentUser?.id || 'usr-std-1',
        studentName,
        studentPhone,
        roomNumber,
        category,
        severity: currentSeverity,
        description: description.trim(),
        incidentDate,
        incidentLocation,
        evidenceFiles,
        isConfidential,
        requestPoliceEscalation,
        userIndicatedEmergency,
      });

      onComplaintSubmitted(created);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className={`p-6 text-white flex items-center justify-between ${
          currentSeverity === 'Emergency'
            ? 'bg-red-900'
            : currentSeverity === 'Serious'
            ? 'bg-amber-900'
            : 'bg-slate-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              {currentSeverity === 'Emergency' ? <ShieldAlert className="w-6 h-6 text-red-300" /> : <AlertTriangle className="w-5 h-5 text-amber-300" />}
            </div>
            <div>
              <h2 className="text-xl font-bold">Submit Hostel Incident / Complaint</h2>
              <p className="text-xs opacity-80">
                System Severity: <span className="font-bold uppercase tracking-wider">{currentSeverity}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IMPORTANT SECTION 35 SAFETY RULES BANNER */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">Legal & Fair Investigation Protocol:</p>
          <p>
            Reports are formally treated as complaints/allegations until verified by hostel management or competent law enforcement. Evidence and sensitive identities are protected in compliance with privacy guidelines.
          </p>
        </div>

        {/* EMERGENCY ACTION STRIP IF EMERGENCY OR SERIOUS */}
        {currentSeverity === 'Emergency' && (
          <div className="p-4 bg-red-100 border-b border-red-300 text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>This matter may require immediate law enforcement or rescue intervention!</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="tel:15" className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
                Call Police 15
              </a>
              <a href="tel:1122" className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs">
                Call 1122
              </a>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Category Selector (All categories from Section 24) */}
          <div>
            <label className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-1">
              Complaint Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs font-semibold bg-white"
            >
              <optgroup label="Hostel Facilities & Maintenance (Hostel Management)">
                <option value="Cleanliness">Cleanliness & Hygiene</option>
                <option value="Room">Room Furniture & Fixture</option>
                <option value="Maintenance">Maintenance & Plumbing</option>
                <option value="Electricity">Electricity & Generator Backup</option>
                <option value="Water">Drinking Water & Water Supply</option>
                <option value="Wi-Fi">Wi-Fi & Internet Connectivity</option>
                <option value="Food">Food Quality & Mess Service</option>
                <option value="Washroom">Washroom & Geyser Issue</option>
                <option value="Noise">Noise & Quiet Hour Violation</option>
                <option value="Staff Behavior">Staff Behavior / Service Issue</option>
              </optgroup>
              <optgroup label="Serious Concerns & Misconduct (Priority Review)">
                <option value="Security">Security Lapses & Gate Breach</option>
                <option value="Harassment">Harassment or Bullying</option>
                <option value="Threats">Verbal Threats or Intimidation</option>
                <option value="Theft">Theft / Stolen Property</option>
                <option value="Illegal Activity">Illegal Activity on Premises</option>
              </optgroup>
              <optgroup label="Emergency & Police Matters (Law Enforcement)">
                <option value="Physical Violence">Physical Violence / Assault</option>
                <option value="Sexual Harassment/Abuse">Sexual Harassment / Abuse</option>
                <option value="Missing Person">Missing Resident / Kidnapping</option>
                <option value="Emergency">Immediate Life & Safety Threat</option>
                <option value="Other">Other Unclassified Matter</option>
              </optgroup>
            </select>
          </div>

          {/* Student Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                disabled={isConfidential}
                placeholder="Resident Name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Room Number *</label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 201"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Incident Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date of Incident *</label>
              <input
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location of Incident *</label>
              <input
                type="text"
                required
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                placeholder="e.g. 2nd Floor Corridor / Study Room / Mess"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="font-bold text-slate-900 text-xs block mb-1">
              Detailed Description of Incident / Problem *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the facts clearly: What happened, who was involved, time, and specific impact..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
            ></textarea>
          </div>

          {/* Evidence Upload Section (Section 34) */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 text-xs block">
              Evidence Attachments (Photos, Screenshots, Serial Numbers, Documents)
            </label>
            <div className="p-3.5 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">Attach supporting files for quicker resolution:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAttachEvidence('incident_photo.jpg', 'image/jpeg')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  + Attach Photo
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachEvidence('proof_doc.pdf', 'application/pdf')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  + Attach Document
                </button>
              </div>
            </div>
            {evidenceFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {evidenceFiles.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{f.name} ({f.size})</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Police Escalation Consent Controls (Section 31 & 32) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <p className="font-bold text-slate-900">Privacy & Escalation Consent:</p>

            {/* Confidential Toggle */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfidential}
                onChange={(e) => setIsConfidential(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-slate-800">Submit as Confidential Complaint</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Your identity is redacted from public logs and only accessible by senior management. (Confidentiality cannot be guaranteed if an official law enforcement warrant legally requires identity disclosures).
                </p>
              </div>
            </label>

            {/* Police Escalation Option (Only shown for Serious or Emergency) */}
            {(currentSeverity === 'Serious' || currentSeverity === 'Emergency') && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestPoliceEscalation}
                    onChange={(e) => setRequestPoliceEscalation(e.target.checked)}
                    className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="font-bold text-red-900">Request Official Police Escalation</span>
                    <p className="text-[11px] text-red-800 mt-0.5">
                      Authorize electronic forwarding of this report to <span className="font-semibold">{police.policeStation}</span> ({police.city}). An official ICT Police Reference Number will be issued.
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 text-xs hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-lg ${
                currentSeverity === 'Emergency'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-700/20 active:scale-98'
                  : 'bg-slate-900 hover:bg-black text-white shadow-black/20 active:scale-98'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Registering Complaint...' : 'Register Formal Complaint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
