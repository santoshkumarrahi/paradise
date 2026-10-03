import React, { useState } from 'react';
import {
  Building2,
  Phone,
  MessageSquare,
  ShieldAlert,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  CalendarCheck,
  LayoutDashboard,
  Sparkles,
  Mail,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenComplaint: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenComplaint,
  onOpenAuth,
}) => {
  const { config } = useHostel();
  const { currentUser, isAuthenticated, logout, quickSwitchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Hostel' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'food', label: 'Food & Mess' },
    { id: 'policies', label: 'Hostel Policies' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'complaints', label: 'Complaints' },
    { id: 'emergency', label: 'Emergency 15', isEmergency: true },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Bar: Dark Navy with [PHONE], [WHATSAPP], [EMAIL], A Safe Place for Your Future, Login/Register */}
      <div className="bg-[#0f1f38] text-slate-200 text-xs py-2 px-4 sm:px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${config.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="Call Hostel Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">{config.phone || '[PHONE]'}</span>
            </a>
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white text-emerald-300 font-medium"
              title="WhatsApp Inquiries"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>{config.whatsapp || '[WHATSAPP]'}</span>
            </a>
            <a
              href={`mailto:${config.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
              title="Official Email"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>{config.email || '[EMAIL]'}</span>
            </a>
          </div>

          {/* Center: Slogan from Reference Design */}
          <div className="hidden lg:block text-slate-300 font-medium tracking-wide">
            A Safe Place for Your Future
          </div>

          {/* Right: Login | Register & Demo Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition font-medium cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-300" />
              <span>{isAuthenticated ? currentUser?.name.split(' ')[0] : 'Login | Register'}</span>
            </button>

            {/* Discreet role switch pill */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/15 text-[10px] text-emerald-300 font-bold border border-white/15 transition cursor-pointer"
                title="Switch demo role (Super Admin, Resident, etc.)"
              >
                {currentUser?.role === 'Super Admin' ? 'Admin' : currentUser?.role === 'Hostel Admin' ? 'Admin' : 'Demo Role'}
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                    Switch Demo User Role
                  </div>
                  {(['Super Admin', 'Hostel Admin', 'Manager', 'Student/Resident'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        quickSwitchRole(role);
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        currentUser?.role === role
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{role}</span>
                      {currentUser?.role === role && <span className="text-emerald-600 font-bold">✓</span>}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab('admin-dashboard');
                        setRoleSwitcherOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-emerald-700 font-bold hover:bg-emerald-50 flex items-center gap-1.5"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Open Admin Panel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hostel Branding (Matching 00_complete_ui_reference.png) */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* SVG Logo: House + Open Book + Leaf elements */}
            <div className="w-12 h-12 flex items-center justify-center text-[#0f1f38] transition-transform group-hover:scale-105">
              <svg viewBox="0 0 64 64" fill="none" className="w-11 h-11" xmlns="http://www.w3.org/2000/svg">
                {/* Roof & House outline */}
                <path d="M12 32L32 14L52 32V48H12V32Z" stroke="#0f1f38" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Chimney */}
                <path d="M42 22V16H47V26.5" stroke="#0f1f38" strokeWidth="3" strokeLinecap="round"/>
                {/* Open Book inside */}
                <path d="M22 34C26 31 32 32 32 36C32 32 38 31 42 34V46C38 43 32 44 32 48C32 44 26 43 22 46V34Z" fill="#0f1f38"/>
                {/* Laurel / Growth Branch 밑 */}
                <path d="M16 52C22 55 28 54 32 50C36 54 42 55 48 52" stroke="#00a859" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#0f1f38] uppercase block leading-none">
                HOSTEL
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] block mt-1">
                STAY • STUDY • GROW
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Hostel' },
              { id: 'rooms', label: 'Rooms' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'food', label: 'Food' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'policies', label: 'Hostel Policies' },
              { id: 'rooms', label: 'Book a Room', isBooking: true },
              { id: 'complaints', label: 'Complaints' },
              { id: 'emergency', label: 'Emergency' },
              { id: 'contact', label: 'Contact Us' },
            ].map((item, idx) => {
              const isActive = activeTab === item.id && !item.isBooking;
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    if (item.isBooking) {
                      onOpenBooking();
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  className={`relative px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-blue-700 font-bold'
                      : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-blue-600 rounded-full animate-in fade-in"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Green BOOK A ROOM Button (Matching 00_complete_ui_reference.png) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* User Dashboard / Login */}
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick(currentUser?.role === 'Student/Resident' ? 'student-dashboard' : 'admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition ${
                    activeTab === 'admin-dashboard' || activeTab === 'student-dashboard'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{currentUser?.role === 'Student/Resident' ? 'My Portal' : 'Admin Panel'}</span>
                </button>
              </div>
            )}

            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00a859] hover:bg-[#00924c] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-700/20 hover:scale-102 active:scale-98 transition cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>BOOK A ROOM</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book a Room</span>
            </button>
            <button
              onClick={() => {
                onOpenComplaint();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Complaints</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : item.isEmergency
                    ? 'text-red-600 font-bold bg-red-50/50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User section in mobile */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick(currentUser?.role === 'Student/Resident' ? 'student-dashboard' : 'admin-dashboard')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs text-center flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{currentUser?.role === 'Student/Resident' ? 'My Student Portal' : 'Admin Control Panel'}</span>
                </button>
                <div className="flex items-center justify-between text-xs px-2 pt-1">
                  <span className="text-slate-500 truncate">{currentUser?.name} ({currentUser?.role})</span>
                  <button onClick={logout} className="text-red-600 font-semibold">Logout</button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
