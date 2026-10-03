import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  Building,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, quickSwitchRole } = useAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [role, setRole] = useState<UserRole>('Student/Resident');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const success = await login(email);
    setLoading(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Invalid email or user not found. You can use one of the one-click demo credentials below.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !email || !phone) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setLoading(true);
    const success = await register({
      name,
      email,
      phone,
      cnic,
      role,
    });
    setLoading(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Registration failed or email already in use.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{mode === 'signin' ? 'Sign In to Portal' : 'Register New Account'}</h2>
              <p className="text-xs text-slate-400">PakHostel Resident & Admin Access</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 text-xs font-bold text-center">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 transition ${
              mode === 'signin' ? 'border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 transition ${
              mode === 'register' ? 'border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register Resident
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-xs text-red-800 flex items-center gap-2 border-b border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="resident@pakhostel.pk or admin@pakhostel.pk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Umar"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="resident@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">CNIC / B-Form Number</label>
                <input
                  type="text"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="35201-XXXXXXX-X"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              One-Click Instant Demo Login
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('Student/Resident');
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900 text-xs">Bilal Ahmad Khan</p>
                  <p className="text-[10px] text-slate-500">Student/Resident (Room 201)</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Resident</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('Super Admin');
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-left transition flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900 text-xs">Syed Hamza Ali</p>
                  <p className="text-[10px] text-slate-500">Super Admin (Full Operations Access)</p>
                </div>
                <span className="text-[10px] font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('Manager');
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-left transition flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900 text-xs">Chaudhry Tariq Mehmood</p>
                  <p className="text-[10px] text-slate-500">Hostel Manager (Bookings & Complaints)</p>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Manager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
