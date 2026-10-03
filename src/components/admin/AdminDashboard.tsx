import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building,
  CalendarCheck,
  CreditCard,
  Users,
  AlertTriangle,
  ShieldAlert,
  Settings,
  Utensils,
  Sparkles,
  FileText,
  Clock,
  Image as ImageIcon,
  History,
  CheckCircle2,
  XCircle,
  X,
  Edit,
  Trash2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  Eye,
  Filter,
  DollarSign,
  Bed,
  Ban,
  Check,
} from 'lucide-react';
import { FeeManagementTab } from './FeeManagementTab';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import {
  Room,
  Booking,
  Payment,
  Complaint,
  AuditLog,
  HostelConfig,
  RoomType,
  PaymentStatus,
  BookingStatus,
} from '../../types';

interface AdminDashboardProps {
  onViewBookingVoucher: (booking: Booking) => void;
  onViewComplaintDetails: (complaint: Complaint) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewBookingVoucher,
  onViewComplaintDetails,
}) => {
  const {
    config,
    updateHostelConfig,
    rooms,
    createRoom,
    updateRoom,
    deleteRoom,
    bookings,
    updateBooking,
    payments,
    verifyPayment,
    complaints,
    updateComplaint,
    escalateToPolice,
    auditLogs,
    stats,
    facilities,
    updateFacility,
    food,
    updateFood,
    policies,
    updatePolicies,
    timings,
    updateTimings,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    feeInvoices,
    toggleRoomSeats,
  } = useHostel();

  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'stats' | 'rooms' | 'bookings' | 'payments' | 'fees' | 'residents' | 'complaints' | 'settings' | 'food_facilities' | 'audit' | 'gallery'
  >('stats');

  // Room seat and category filter in admin
  const [roomFilter, setRoomFilter] = useState<'all' | 'open' | 'closed' | 'maintenance'>('all');

  // Room modal form state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomFormData, setRoomFormData] = useState<Partial<Room>>({
    roomNumber: '',
    roomType: '2-seater',
    floor: '1st Floor',
    capacity: 2,
    totalBeds: 2,
    occupiedBeds: 0,
    monthlyRent: 20000,
    securityDeposit: 10000,
    status: 'Available',
    attachedWashroom: true,
    balcony: false,
    hasAC: false,
    description: '',
    seatsClosed: false,
    closedReason: '',
  });

  // Verification modal state for payments
  const [verifyingPayment, setVerifyingPayment] = useState<Payment | null>(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');

  // Police Escalation confirmation modal state
  const [escalatingComplaint, setEscalatingComplaint] = useState<Complaint | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');

  // Config editor state
  const [configForm, setConfigForm] = useState<HostelConfig>(config);

  // Sync config form if config changes
  React.useEffect(() => {
    setConfigForm(config);
  }, [config]);

  // Handle Room Save
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      await updateRoom(editingRoom.id, roomFormData, currentUser?.name || 'Admin');
    } else {
      await createRoom(roomFormData, currentUser?.name || 'Admin');
    }
    setIsRoomModalOpen(false);
    setEditingRoom(null);
  };

  // Open Room Modal
  const openEditRoom = (r: Room) => {
    setEditingRoom(r);
    setRoomFormData(r);
    setIsRoomModalOpen(true);
  };

  const openAddRoom = () => {
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: '',
      roomType: '2-seater',
      floor: '1st Floor',
      capacity: 2,
      totalBeds: 2,
      occupiedBeds: 0,
      monthlyRent: 22000,
      securityDeposit: 12000,
      status: 'Available',
      attachedWashroom: true,
      balcony: false,
      hasAC: false,
      description: 'Newly furnished room with individual study and wardrobe setup.',
      images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'],
    });
    setIsRoomModalOpen(true);
  };

  // 1-Click Toggle Room Seats Closed / Open
  const handleToggleRoomSeats = async (room: Room) => {
    const willClose = !room.seatsClosed;
    await toggleRoomSeats(
      room.id,
      willClose,
      willClose ? 'Seats Closed by Hostel Administrator' : undefined,
      currentUser?.name || 'Admin'
    );
  };

  // Quick increment/decrement occupied bed count
  const handleAdjustBedOccupancy = async (room: Room, delta: number) => {
    const nextOccupied = Math.max(0, Math.min(room.totalBeds, room.occupiedBeds + delta));
    const nextStatus: Room['status'] = nextOccupied >= room.totalBeds ? 'Occupied' : 'Available';
    await updateRoom(
      room.id,
      { occupiedBeds: nextOccupied, status: nextStatus },
      currentUser?.name || 'Admin'
    );
  };

  // Quick bulk action: close or open all seats of a given room type
  const handleBulkSeatAction = async (type: RoomType | 'all', shouldClose: boolean) => {
    const targets = type === 'all' ? rooms : rooms.filter((r) => r.roomType === type);
    for (const r of targets) {
      await toggleRoomSeats(
        r.id,
        shouldClose,
        shouldClose ? `Bulk Closed for ${type} rooms` : undefined,
        currentUser?.name || 'Admin'
      );
    }
  };

  // Handle Payment Verification submission
  const handleVerifySubmit = async (status: PaymentStatus) => {
    if (!verifyingPayment) return;
    await verifyPayment(verifyingPayment.id, status, verificationRemarks || 'Verified against bank transaction logs', currentUser?.name || 'Admin');
    setVerifyingPayment(null);
    setVerificationRemarks('');
  };

  // Handle Police Escalation Action
  const handleTriggerPoliceEscalation = async () => {
    if (!escalatingComplaint) return;
    await escalateToPolice(escalatingComplaint.id, currentUser?.name || 'Admin', officerNotes);
    setEscalatingComplaint(null);
    setOfficerNotes('');
  };

  // Handle Master Config Save
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHostelConfig(configForm, currentUser?.name || 'Admin');
  };

  return (
    <div className="py-10 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Admin Header */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold">{config.name}</h1>
                <span className="text-[11px] font-bold text-emerald-400 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Operator: <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.role}) • Police Station: {config.policeConfig.policeStation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setActiveTab('fees')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer text-white"
            >
              <DollarSign className="w-4 h-4" />
              <span>Manage Fees ({feeInvoices.length})</span>
            </button>
            <button
              onClick={openAddRoom}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Hostel Settings</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap border-b border-slate-200 bg-white p-2 rounded-2xl shadow-xs text-xs font-bold gap-1">
          {[
            { id: 'stats', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'rooms', label: `Rooms & Seats (${rooms.length})`, icon: Building },
            { id: 'fees', label: `Manage Fees & Challans (${feeInvoices.length})`, icon: DollarSign },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: CalendarCheck },
            { id: 'payments', label: `Payments (${payments.length})`, icon: CreditCard },
            { id: 'residents', label: 'Residents Directory', icon: Users },
            { id: 'complaints', label: `Complaints & Police (${complaints.length})`, icon: ShieldAlert },
            { id: 'food_facilities', label: 'Food & Facilities', icon: Utensils },
            { id: 'settings', label: 'Hostel Settings & Police', icon: Settings },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: ImageIcon },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: History },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD STATS (SECTION 45) */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 15 Statistics Cards as required by Section 45 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Rooms</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalRooms ?? rooms.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase">Available Rooms</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.availableRooms ?? rooms.filter(r => r.status === 'Available').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Occupied Rooms</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{stats?.occupiedRooms ?? rooms.filter(r => r.status === 'Occupied').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-amber-700 uppercase">Maintenance</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{stats?.maintenanceRooms ?? rooms.filter(r => r.status === 'Maintenance').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Residents</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalResidents ?? bookings.filter(b => b.bookingStatus === 'Confirmed').length}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-amber-700 uppercase">Pending Bookings</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pendingBookings ?? bookings.filter(b => b.bookingStatus === 'Pending' || b.bookingStatus === 'Under Verification').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase">Confirmed Bookings</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.confirmedBookings ?? bookings.filter(b => b.bookingStatus === 'Confirmed').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-amber-700 uppercase">Pending Payments</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pendingPayments ?? payments.filter(p => p.status === 'Verification Pending').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase">Verified Payments</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.verifiedPayments ?? payments.filter(p => p.status === 'Payment Verified').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-800 uppercase">Total PKR Revenue</span>
                <p className="text-xl font-black text-slate-900 mt-1 truncate">
                  PKR {(stats?.totalRevenuePKR ?? payments.filter(p => p.status === 'Payment Verified').reduce((sum, p) => sum + p.amount, 0)).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-sky-700 uppercase">Open Complaints</span>
                <p className="text-2xl font-black text-sky-600 mt-1">{stats?.pendingComplaints ?? complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-amber-800 uppercase">Serious Reports</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{stats?.seriousComplaints ?? complaints.filter(c => c.severity === 'Serious').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-red-700 uppercase">Emergency Threats</span>
                <p className="text-2xl font-black text-red-600 mt-1">{stats?.emergencyComplaints ?? complaints.filter(c => c.severity === 'Emergency').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase">Resolved Issues</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.resolvedComplaints ?? complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md">
                <span className="text-xs font-bold text-indigo-300 uppercase">Police Escalations</span>
                <p className="text-2xl font-black text-white mt-1">{stats?.policeEscalations ?? complaints.filter(c => c.policeReferenceNumber).length}</p>
              </div>
            </div>

            {/* Quick Pending Items Review Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Bookings Review */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Pending Bookings & Verification</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-emerald-700 font-bold hover:underline">
                    View All ({bookings.length})
                  </button>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {bookings.slice(0, 4).map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{b.residentName}</p>
                        <p className="text-slate-500 font-mono text-[11px]">{b.id} • {b.roomTypeId} (PKR {b.totalInitialPayment.toLocaleString()})</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">{b.bookingStatus}</span>
                        <button
                          onClick={() => onViewBookingVoucher(b)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold text-[11px]"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Complaints & Police Review */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Active Complaints & Incidents</h3>
                  <button onClick={() => setActiveTab('complaints')} className="text-xs text-emerald-700 font-bold hover:underline">
                    View All ({complaints.length})
                  </button>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {complaints.slice(0, 4).map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{c.category} - {c.studentName}</p>
                        <p className="text-slate-500 line-clamp-1">{c.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${c.severity === 'Emergency' ? 'bg-red-100 text-red-800' : c.severity === 'Serious' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                          {c.severity}
                        </span>
                        <button
                          onClick={() => onViewComplaintDetails(c)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold text-[11px]"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROOM MANAGEMENT & SEAT AVAILABILITY CONTROLS */}
        {activeTab === 'rooms' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Room & Seat Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Rooms</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{rooms.length} Rooms</p>
                <span className="text-[11px] text-slate-400 mt-1 block">Total capacity: {rooms.reduce((a, b) => a + b.totalBeds, 0)} beds</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Seats Open (Admissions Active)</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {rooms.filter((r) => !r.seatsClosed && r.status === 'Available' && r.occupiedBeds < r.totalBeds).length} Rooms
                </p>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                  {rooms.reduce((acc, r) => acc + (r.seatsClosed ? 0 : Math.max(0, r.totalBeds - r.occupiedBeds)), 0)} Vacant Beds available
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Seats Closed / Full</span>
                <p className="text-2xl font-black text-rose-600 mt-1">
                  {rooms.filter((r) => r.seatsClosed || r.occupiedBeds >= r.totalBeds || r.status === 'Occupied').length} Rooms
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {rooms.filter((r) => r.seatsClosed).length} locked by admin • {rooms.filter((r) => !r.seatsClosed && r.occupiedBeds >= r.totalBeds).length} full
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Fee Management</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">Room Rent & Deposits</p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">PKR 14,000 - 32,000/mo</span>
                </div>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="mt-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Fee Manager</span>
                </button>
              </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Room Inventory, Seat Status & Fee Management</h3>
                  <p className="text-xs text-slate-500">
                    Control admissions by closing or opening seats, adjust bed occupancy, and configure monthly fees.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleBulkSeatAction('all', false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    title="Re-open all rooms that were closed"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Open All Seats</span>
                  </button>

                  <button
                    onClick={() => handleBulkSeatAction('1-seater', true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    title="Close admissions for 1-seater single rooms"
                  >
                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                    <span>Close 1-Seater Seats</span>
                  </button>

                  <button
                    onClick={openAddRoom}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Room</span>
                  </button>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
                <span className="text-slate-500 font-medium">Filter by Status:</span>
                <button
                  onClick={() => setRoomFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    roomFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Rooms ({rooms.length})
                </button>
                <button
                  onClick={() => setRoomFilter('open')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    roomFilter === 'open'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Seats Open ({rooms.filter((r) => !r.seatsClosed && r.status === 'Available' && r.occupiedBeds < r.totalBeds).length})
                </button>
                <button
                  onClick={() => setRoomFilter('closed')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    roomFilter === 'closed'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Seats Closed / Full ({rooms.filter((r) => r.seatsClosed || r.occupiedBeds >= r.totalBeds).length})
                </button>
                <button
                  onClick={() => setRoomFilter('maintenance')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    roomFilter === 'maintenance'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Maintenance ({rooms.filter((r) => r.status === 'Maintenance').length})
                </button>
              </div>

              {/* Rooms Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3.5">Room #</th>
                      <th className="p-3.5">Category & Floor</th>
                      <th className="p-3.5">Bed Capacity & Adjuster</th>
                      <th className="p-3.5">Monthly Rent</th>
                      <th className="p-3.5">Security Deposit</th>
                      <th className="p-3.5">Seat Status</th>
                      <th className="p-3.5">Admin Seat Control</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rooms
                      .filter((r) => {
                        if (roomFilter === 'open') return !r.seatsClosed && r.status === 'Available' && r.occupiedBeds < r.totalBeds;
                        if (roomFilter === 'closed') return r.seatsClosed || r.occupiedBeds >= r.totalBeds;
                        if (roomFilter === 'maintenance') return r.status === 'Maintenance';
                        return true;
                      })
                      .map((r) => {
                        const freeBeds = Math.max(0, r.totalBeds - r.occupiedBeds);
                        const isClosed = !!r.seatsClosed;
                        const isFull = r.occupiedBeds >= r.totalBeds;

                        return (
                          <tr key={r.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-bold text-slate-900 font-mono">Room {r.roomNumber}</td>
                            <td className="p-3.5">
                              <span className="font-semibold text-slate-900 capitalize block">{r.roomType}</span>
                              <span className="text-[11px] text-slate-500">{r.floor}</span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800">
                                  {r.occupiedBeds} / {r.totalBeds} beds ({freeBeds} free)
                                </span>
                                <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-[11px]">
                                  <button
                                    onClick={() => handleAdjustBedOccupancy(r, -1)}
                                    disabled={r.occupiedBeds <= 0}
                                    title="Vacate 1 bed"
                                    className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold"
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={() => handleAdjustBedOccupancy(r, 1)}
                                    disabled={r.occupiedBeds >= r.totalBeds}
                                    title="Occupy 1 bed"
                                    className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900 font-mono">
                              PKR {r.monthlyRent.toLocaleString()}
                            </td>
                            <td className="p-3.5 text-slate-700 font-mono">
                              PKR {r.securityDeposit.toLocaleString()}
                            </td>
                            <td className="p-3.5">
                              {isClosed ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-rose-100 text-rose-800 border border-rose-200">
                                  <Ban className="w-3 h-3 text-rose-600" />
                                  <span>Seats Closed</span>
                                </span>
                              ) : isFull ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 border border-amber-200">
                                  <span>Full ({r.totalBeds}/{r.totalBeds})</span>
                                </span>
                              ) : r.status === 'Maintenance' ? (
                                <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-purple-100 text-purple-800">
                                  Maintenance
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>{freeBeds} Free Seats</span>
                                </span>
                              )}
                              {r.closedReason && (
                                <span className="text-[10px] text-slate-500 block mt-0.5 italic truncate max-w-[120px]" title={r.closedReason}>
                                  {r.closedReason}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleRoomSeats(r)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1 cursor-pointer ${
                                  isClosed
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {isClosed ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Open Seats</span>
                                  </>
                                ) : (
                                  <>
                                    <Ban className="w-3 h-3" />
                                    <span>Close Seats</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => openEditRoom(r)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                title="Edit Room & Pricing"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove Room ${r.roomNumber}?`)) {
                                    deleteRoom(r.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                title="Delete Room"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FEE MANAGEMENT & INVOICING (ADMINISTRATIVE DUES, CHALLANS, UTILITIES) */}
        {activeTab === 'fees' && <FeeManagementTab />}

        {/* TAB 4: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Booking Applications & Allocations</h3>
                <p className="text-xs text-slate-500">Approve, reject, assign rooms, and process check-ins.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Resident</th>
                    <th className="p-3.5">Room</th>
                    <th className="p-3.5">Phone / WhatsApp</th>
                    <th className="p-3.5">Check-in</th>
                    <th className="p-3.5">Total Initial</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5 text-right">Status Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{b.residentName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{b.cnic}</p>
                      </td>
                      <td className="p-3.5 capitalize font-semibold">
                        {b.roomTypeId} (Allocated: {b.assignedRoomNumber || b.preferredRoomNumber || 'None'})
                      </td>
                      <td className="p-3.5 text-slate-600">{b.phone}</td>
                      <td className="p-3.5">{b.checkInDate}</td>
                      <td className="p-3.5 font-bold">PKR {b.totalInitialPayment.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800 text-[11px]">
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${b.paymentStatus === 'Payment Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => onViewBookingVoucher(b)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                        >
                          Voucher
                        </button>
                        {b.bookingStatus !== 'Confirmed' && (
                          <button
                            onClick={() => updateBooking(b.id, { bookingStatus: 'Confirmed', paymentStatus: 'Payment Verified' }, currentUser?.name)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                          >
                            Confirm
                          </button>
                        )}
                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => updateBooking(b.id, { bookingStatus: 'Checked In' }, currentUser?.name)}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-black text-white font-bold text-[11px]"
                          >
                            Check-in
                          </button>
                        )}
                        {b.bookingStatus !== 'Rejected' && b.bookingStatus !== 'Cancelled' && (
                          <button
                            onClick={() => updateBooking(b.id, { bookingStatus: 'Rejected' }, currentUser?.name)}
                            className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS MANAGEMENT (VERIFICATION) */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Pakistani Payment Reconciliations</h3>
                <p className="text-xs text-slate-500">Verify JazzCash, Easypaisa, and 1Link Bank transfers with receipt inspection.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Payment ID</th>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Resident</th>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5">Transaction ID</th>
                    <th className="p-3.5">Amount (PKR)</th>
                    <th className="p-3.5">Receipt</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="p-3.5 font-mono text-slate-600">{p.bookingId}</td>
                      <td className="p-3.5 font-bold text-slate-900">{p.residentName}</td>
                      <td className="p-3.5 font-bold">{p.method}</td>
                      <td className="p-3.5 font-mono text-slate-800">{p.transactionId}</td>
                      <td className="p-3.5 font-black text-slate-900">PKR {p.amount.toLocaleString()}</td>
                      <td className="p-3.5">
                        {p.receiptImageUrl ? (
                          <a
                            href={p.receiptImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                          >
                            <span>View Proof</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${p.status === 'Payment Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {p.status === 'Verification Pending' ? (
                          <button
                            onClick={() => {
                              setVerifyingPayment(p);
                              setVerificationRemarks('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                          >
                            Verify / Reject
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Reconciled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: RESIDENTS DIRECTORY */}
        {activeTab === 'residents' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Active Residents & Guardian Registry</h3>
              <p className="text-xs text-slate-500">Official police verified resident book for emergency contact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').map((r) => (
                <div key={r.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700">Room {r.assignedRoomNumber || '201'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {r.bookingStatus}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.residentName}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">CNIC: {r.cnic}</p>
                    <p className="text-xs text-slate-500">{r.instituteCompany || 'Student'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                    <p>Phone: <strong className="text-slate-900">{r.phone}</strong></p>
                    <p>Guardian: <strong className="text-slate-900">{r.emergencyContactName} ({r.emergencyContactNumber})</strong></p>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => onViewBookingVoucher(r)}
                      className="text-xs text-emerald-700 font-semibold hover:underline"
                    >
                      View Registration Slip
                    </button>
                    <button
                      onClick={() => updateBooking(r.id, { bookingStatus: 'Checked Out' }, currentUser?.name)}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Check-out Resident
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMPLAINTS & OFFICIAL POLICE ESCALATION DASHBOARD */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>Complaints & Police Escalation Operations</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review student grievances, assign staff, and officially escalate emergency/criminal matters to {config.policeConfig.policeStation}.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className={`p-5 rounded-2xl border transition space-y-3 ${
                    c.severity === 'Emergency'
                      ? 'border-red-300 bg-red-50/40'
                      : c.severity === 'Serious'
                      ? 'border-amber-300 bg-amber-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{c.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.severity === 'Emergency' ? 'bg-red-600 text-white' : c.severity === 'Serious' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {c.severity}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">• {c.category}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{c.description}</p>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 pt-2 border-t border-slate-200/60">
                    <span>Complainant: <strong>{c.studentName}</strong> (Room {c.roomNumber})</span>
                    <span>Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* If already escalated to police, show official reference */}
                  {c.policeReferenceNumber ? (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold block">Official Police Reference: {c.policeReferenceNumber}</span>
                        <span>Assigned to: {c.policeStation || config.policeConfig.policeStation}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-[11px]">
                        {c.policeStatus || 'Submitted'}
                      </span>
                    </div>
                  ) : (
                    /* If not escalated yet, offer button for Serious or Emergency */
                    (c.severity === 'Serious' || c.severity === 'Emergency') && (
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEscalatingComplaint(c);
                            setOfficerNotes('');
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Escalate Electronically to Police Station</span>
                        </button>
                      </div>
                    )
                  )}

                  {/* Management actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => onViewComplaintDetails(c)}
                      className="text-slate-700 font-semibold hover:underline"
                    >
                      View Full Details & Evidence
                    </button>

                    <div className="flex items-center gap-2">
                      <select
                        value={c.status}
                        onChange={(e) => updateComplaint(c.id, { status: e.target.value as any }, currentUser?.name)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Escalated to Police">Escalated to Police</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: HOSTEL CONFIGURATION & POLICE JURISDICTION (SECTION 52) */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Editable Master Hostel Information (Section 52)</h3>
              <p className="text-xs text-slate-500">
                All fields are editable directly without altering codebase.
              </p>
            </div>

            {/* General Info */}
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
                General Profile & Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hostel Name</label>
                  <input
                    type="text"
                    value={configForm.name}
                    onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={configForm.tagline}
                    onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Complete Address</label>
                  <input
                    type="text"
                    value={configForm.address}
                    onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Area</label>
                  <input
                    type="text"
                    value={configForm.area}
                    onChange={(e) => setConfigForm({ ...configForm, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={configForm.city}
                    onChange={(e) => setConfigForm({ ...configForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={configForm.district}
                    onChange={(e) => setConfigForm({ ...configForm, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Hotline</label>
                  <input
                    type="text"
                    value={configForm.phone}
                    onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={configForm.whatsapp}
                    onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Police Routing Settings (Section 28) */}
            <div className="space-y-4 text-xs pt-4 border-t border-slate-100">
              <h4 className="font-bold text-red-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Official Police & Law Enforcement Routing (Section 28)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Designated Police Station</label>
                  <input
                    type="text"
                    value={configForm.policeConfig.policeStation}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        policeConfig: { ...configForm.policeConfig, policeStation: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Station Direct Phone</label>
                  <input
                    type="text"
                    value={configForm.policeConfig.stationDirectPhone}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        policeConfig: { ...configForm.policeConfig, stationDirectPhone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Official Complaint Portal URL</label>
                  <input
                    type="text"
                    value={configForm.policeConfig.officialComplaintPortal}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        policeConfig: { ...configForm.policeConfig, officialComplaintPortal: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Electronic Integration API Status</label>
                  <select
                    value={configForm.policeConfig.apiStatus}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        policeConfig: {
                          ...configForm.policeConfig,
                          apiStatus: e.target.value as any,
                          apiAvailable: e.target.value === 'Operational',
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs bg-white"
                  >
                    <option value="Operational">Operational (Live Electronic Filing)</option>
                    <option value="Degraded">Degraded (Direct Call Mandatory)</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pakistani Payment Accounts Settings (Section 19) */}
            <div className="space-y-4 text-xs pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
                Pakistani Payment Gateways (JazzCash, Easypaisa, Bank Transfer)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">JazzCash Account #</label>
                  <input
                    type="text"
                    value={configForm.paymentAccounts.jazzCash.accountNumber}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        paymentAccounts: {
                          ...configForm.paymentAccounts,
                          jazzCash: { ...configForm.paymentAccounts.jazzCash, accountNumber: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Easypaisa Account #</label>
                  <input
                    type="text"
                    value={configForm.paymentAccounts.easypaisa.accountNumber}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        paymentAccounts: {
                          ...configForm.paymentAccounts,
                          easypaisa: { ...configForm.paymentAccounts.easypaisa, accountNumber: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={configForm.paymentAccounts.bankTransfer.bankName}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        paymentAccounts: {
                          ...configForm.paymentAccounts,
                          bankTransfer: { ...configForm.paymentAccounts.bankTransfer, bankName: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bank IBAN</label>
                  <input
                    type="text"
                    value={configForm.paymentAccounts.bankTransfer.iban}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        paymentAccounts: {
                          ...configForm.paymentAccounts,
                          bankTransfer: { ...configForm.paymentAccounts.bankTransfer, iban: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Save Master Hostel Information
              </button>
            </div>
          </form>
        )}

        {/* TAB 8: FOOD & FACILITIES EDITOR */}
        {activeTab === 'food_facilities' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Food pricing & package */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Mess Pricing & Package (Section 16)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Breakfast (PKR)</label>
                  <input
                    type="number"
                    value={food.breakfastPrice}
                    onChange={(e) => updateFood({ breakfastPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lunch (PKR)</label>
                  <input
                    type="number"
                    value={food.lunchPrice}
                    onChange={(e) => updateFood({ lunchPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dinner (PKR)</label>
                  <input
                    type="number"
                    value={food.dinnerPrice}
                    onChange={(e) => updateFood({ dinnerPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Monthly Plan (PKR)</label>
                  <input
                    type="number"
                    value={food.monthlyPackagePrice}
                    onChange={(e) => updateFood({ monthlyPackagePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Facilities toggle */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Facility Availability Toggles (Section 10)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {facilities.map((fac) => (
                  <div key={fac.id} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{fac.name}</p>
                      <span className="text-[10px] text-slate-500">{fac.category}</span>
                    </div>
                    <button
                      onClick={() => updateFacility(fac.id, { isEnabled: !fac.isEnabled })}
                      className={`px-3 py-1 rounded-full font-bold text-[11px] transition ${
                        fac.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {fac.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Manage Hostel Photos</h3>
              <button
                onClick={() => {
                  const title = prompt('Enter photo title:');
                  if (!title) return;
                  const imageUrl = prompt('Enter image URL:', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80');
                  if (!imageUrl) return;
                  addGalleryItem({
                    title,
                    category: 'Rooms',
                    imageUrl,
                    caption: 'New authentic photo added by admin.',
                  });
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                + Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3]">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                    <p className="font-bold">{g.title}</p>
                    <button
                      onClick={() => deleteGalleryItem(g.id)}
                      className="self-end px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[10px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: AUDIT LOGS (SECTION 44) */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-700" />
                  <span>Immutable System Audit Trail (Section 44)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive audit record of all booking modifications, payment verifications, and official law enforcement actions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Log ID</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">User & Role</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((l) => (
                    <tr key={l.id} className={l.isPoliceAction ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}>
                      <td className="p-3.5 font-mono text-slate-500">{l.id}</td>
                      <td className="p-3.5 text-slate-600 whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {l.isPoliceAction && <span className="text-indigo-700 mr-1">⚖️</span>}
                        {l.action}
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-slate-600 font-semibold">{l.entityType}: {l.entityId}</span>
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{l.performedBy}</p>
                        <p className="text-[10px] text-slate-500">{l.userRole}</p>
                      </td>
                      <td className="p-3.5 text-slate-700">{l.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT ROOM */}
        {isRoomModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <h3 className="font-bold text-base">{editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'}</h3>
                <button onClick={() => setIsRoomModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRoom} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Room Number *</label>
                    <input
                      type="text"
                      required
                      value={roomFormData.roomNumber}
                      onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                      placeholder="e.g. 303"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={roomFormData.roomType}
                      onChange={(e) => {
                        const val = e.target.value as RoomType;
                        const cap = val === '1-seater' ? 1 : val === '2-seater' ? 2 : val === '3-seater' ? 3 : 4;
                        setRoomFormData({ ...roomFormData, roomType: val, capacity: cap, totalBeds: cap });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      <option value="1-seater">1-Seater</option>
                      <option value="2-seater">2-Seater</option>
                      <option value="3-seater">3-Seater</option>
                      <option value="4-seater">4-Seater</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Floor</label>
                    <input
                      type="text"
                      value={roomFormData.floor}
                      onChange={(e) => setRoomFormData({ ...roomFormData, floor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Total Beds</label>
                    <input
                      type="number"
                      value={roomFormData.totalBeds}
                      onChange={(e) => setRoomFormData({ ...roomFormData, totalBeds: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Occupied Beds</label>
                    <input
                      type="number"
                      value={roomFormData.occupiedBeds}
                      onChange={(e) => setRoomFormData({ ...roomFormData, occupiedBeds: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Monthly Rent (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={roomFormData.monthlyRent}
                      onChange={(e) => setRoomFormData({ ...roomFormData, monthlyRent: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Security Deposit (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={roomFormData.securityDeposit}
                      onChange={(e) => setRoomFormData({ ...roomFormData, securityDeposit: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={roomFormData.status}
                    onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Seat Admissions Closed Control */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Close Room Seats / Admissions</span>
                      <p className="text-[11px] text-slate-500">Lock all beds in this room from public booking requests</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!roomFormData.seatsClosed}
                        onChange={(e) => setRoomFormData({ ...roomFormData, seatsClosed: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>

                  {roomFormData.seatsClosed && (
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Reason for Closing (Shown on Room Badge)</label>
                      <input
                        type="text"
                        value={roomFormData.closedReason || ''}
                        onChange={(e) => setRoomFormData({ ...roomFormData, closedReason: e.target.value })}
                        placeholder="e.g. Reserved for semester cohort / Annual overhaul"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={roomFormData.description}
                    onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRoomModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Save Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: PAYMENT VERIFICATION (SECTION 19) */}
        {verifyingPayment && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <h3 className="font-bold text-base">Reconcile Payment {verifyingPayment.id}</h3>
                <button onClick={() => setVerifyingPayment(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Method:</span>
                    <strong className="text-slate-900">{verifyingPayment.method}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TID:</span>
                    <strong className="font-mono text-slate-900">{verifyingPayment.transactionId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <strong className="text-emerald-700 font-bold">PKR {verifyingPayment.amount.toLocaleString()}</strong>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Reconciliation Remarks</label>
                  <input
                    type="text"
                    value={verificationRemarks}
                    onChange={(e) => setVerificationRemarks(e.target.value)}
                    placeholder="e.g. Matched bank credit SMS at 14:22"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleVerifySubmit('Payment Verified')}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    ✓ Confirm & Verify Payment
                  </button>
                  <button
                    onClick={() => handleVerifySubmit('Payment Failed')}
                    className="px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ESCALATE COMPLAINT TO POLICE (SECTION 29) */}
        {escalatingComplaint && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              <div className="bg-red-950 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <h3 className="font-bold text-base">Transmit Official Police Escalation</h3>
                </div>
                <button onClick={() => setEscalatingComplaint(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-1">
                  <p className="font-bold">Authorized Law Enforcement Agency:</p>
                  <p>{config.policeConfig.policeStation} ({config.policeConfig.city}, {config.policeConfig.district})</p>
                  <p className="text-[11px] text-red-700">Official Helpline: {config.policeConfig.officialPolicePhone}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Complainant / Incident:</span>
                  <p className="font-bold text-slate-900">{escalatingComplaint.category} - {escalatingComplaint.studentName}</p>
                  <p className="text-slate-600 mt-1">{escalatingComplaint.description}</p>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hostel Warden / Officer Incident Brief</label>
                  <textarea
                    rows={3}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    placeholder="Enter formal summary of incident and CCTV evidence preserved for investigating officer..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setEscalatingComplaint(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTriggerPoliceEscalation}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Authorize & Transmit to Police</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
