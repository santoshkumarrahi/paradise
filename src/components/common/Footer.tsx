import React from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  CalendarCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenComplaint: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking, onOpenComplaint }) => {
  const { config } = useHostel();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* FINAL HOMEPAGE CTA STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider text-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified & Secure Student Residence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Book Your Room?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Choose your room, check real-time bed availability, select your food package, and secure your room online with instant JazzCash, Easypaisa, or Bank Transfer.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 shadow-lg shadow-black/20 hover:scale-102 active:scale-98 transition flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-700" />
                <span>Book a Room Now</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 rounded-xl bg-emerald-950/60 border border-white/20 text-white font-semibold text-sm hover:bg-emerald-950/80 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Contact Hostel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Hostel Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                {config.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {config.tagline}. Safe, high-standard student and professional accommodation with 24-hour backup electricity, purified RO water, nutritious food, and fast fiber Wi-Fi in {config.city}, Pakistan.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{config.address}, {config.area}, {config.city}, {config.country}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{config.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{config.email}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase text-slate-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition">About Hostel</button>
              </li>
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-emerald-400 transition">Rooms & Pricing</button>
              </li>
              <li>
                <button onClick={() => onNavigate('facilities')} className="hover:text-emerald-400 transition">Facilities & Amenities</button>
              </li>
              <li>
                <button onClick={() => onNavigate('food')} className="hover:text-emerald-400 transition">Food & Mess Menu</button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-emerald-400 transition">Hostel Gallery</button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-emerald-400 transition">Hostel Policies & Timings</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Services & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase text-slate-200">
              Resident Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenBooking} className="hover:text-emerald-400 font-semibold text-emerald-400 transition">Online Room Booking</button>
              </li>
              <li>
                <button onClick={onOpenComplaint} className="hover:text-emerald-400 transition">Hostel Complaint Portal</button>
              </li>
              <li>
                <button onClick={() => onNavigate('student-dashboard')} className="hover:text-emerald-400 transition">Resident Dashboard</button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency')} className="text-red-400 hover:text-red-300 font-bold transition flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Emergency Assistance</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-emerald-400 transition">Fee & Refund Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition">Contact Hostel Warden</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Emergency & Law Enforcement */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Official Emergency</span>
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Police Helpline:</span>
                <a href="tel:15" className="text-red-400 font-bold hover:underline">15</a>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Rescue Ambulance:</span>
                <a href="tel:1122" className="text-emerald-400 font-bold hover:underline">1122</a>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>CPLC Helpline:</span>
                <a href="tel:1102" className="text-sky-400 font-bold hover:underline">1102</a>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Station: {config.policeConfig.policeStation}</span>
              </div>
            </div>
            <a
              href={config.policeConfig.officialComplaintPortal}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
            >
              <span>{config.policeConfig.portalName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {config.name}. All Rights Reserved. Regulated in {config.city}, Pakistan.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Currency: PKR (Pakistani Rupee)</span>
            <span>•</span>
            <button onClick={() => onNavigate('policies')} className="hover:text-slate-300">Privacy & Terms</button>
            <span>•</span>
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Official WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
