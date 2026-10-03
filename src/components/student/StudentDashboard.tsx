import React, { useState } from 'react';
import {
  User,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  FileText,
  Clock,
  Printer,
  Upload,
  Plus,
  Building,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { Booking, Payment, Complaint } from '../../types';
import { EmergencyBanner } from '../common/EmergencyBanner';

interface StudentDashboardProps {
  onOpenBooking: () => void;
  onOpenComplaint: () => void;
  onViewBookingVoucher: (booking: Booking) => void;
  onOpenPaymentModal: (booking: Booking) => void;
  onViewComplaintDetails: (complaint: Complaint) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenBooking,
  onOpenComplaint,
  onViewBookingVoucher,
  onOpenPaymentModal,
  onViewComplaintDetails,
}) => {
  const { config, bookings, payments, complaints } = useHostel();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'payments' | 'complaints'>('overview');

  // Filter items belonging to current student
  const userBookings = bookings.filter((b) => b.userId === currentUser?.id || b.residentName === currentUser?.name);
  const userPayments = payments.filter((p) => p.userId === currentUser?.id || p.residentName === currentUser?.name);
  const userComplaints = complaints.filter((c) => c.userId === currentUser?.id || c.studentName === currentUser?.name);

  const activeBooking = userBookings[0] || null;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Emergency Fast Banner */}
        <EmergencyBanner compact onOpenComplaint={onOpenComplaint} />

        {/* Profile Card & Welcome */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {currentUser?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{currentUser?.name || 'Resident'}</h1>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Verified Resident
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Room #{currentUser?.roomNumber || activeBooking?.assignedRoomNumber || '201'} • {currentUser?.institute || 'University Resident'}
              </p>
              <p className="text-xs text-slate-400">
                Email: {currentUser?.email} • Phone: {currentUser?.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenComplaint}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Submit Complaint</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Room Booking</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition ${activeTab === 'overview' ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Overview & Room Info
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 transition ${activeTab === 'bookings' ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            My Bookings ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 transition ${activeTab === 'payments' ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Payment History & Invoices ({userPayments.length})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`pb-3 transition ${activeTab === 'complaints' ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            My Complaints & Police Tracking ({userComplaints.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Active Booking Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Current Accommodation</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Room {activeBooking?.assignedRoomNumber || activeBooking?.preferredRoomNumber || '201'} ({activeBooking?.roomTypeId || '2-seater'})
                  </h3>
                </div>
                {activeBooking && (
                  <button
                    onClick={() => onViewBookingVoucher(activeBooking)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Voucher</span>
                  </button>
                )}
              </div>

              {activeBooking ? (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-slate-500 text-xs">Booking ID:</span>
                      <p className="font-mono font-bold text-slate-900">{activeBooking.id}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs">Check-in Date:</span>
                      <p className="font-bold text-slate-900">{activeBooking.checkInDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs">Booking Status:</span>
                      <p className="font-bold text-emerald-700">{activeBooking.bookingStatus}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs">Monthly Rent:</span>
                      <p className="font-bold text-slate-900">PKR {activeBooking.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs">Security Deposit:</span>
                      <p className="font-bold text-slate-900">PKR {activeBooking.securityDeposit.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs">Payment Status:</span>
                      <p className="font-bold text-emerald-700">{activeBooking.paymentStatus}</p>
                    </div>
                  </div>

                  {activeBooking.paymentStatus !== 'Payment Verified' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-amber-900 text-xs">Payment Pending Verification</p>
                        <p className="text-[11px] text-amber-700">Submit your JazzCash / Easypaisa TID to clear dues.</p>
                      </div>
                      <button
                        onClick={() => onOpenPaymentModal(activeBooking)}
                        className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs"
                      >
                        Upload Payment Proof
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No active bookings found. Click "New Room Booking" to apply.</p>
              )}
            </div>

            {/* Quick Policies & Emergency Contact side card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Hostel Warden & Security Contact</span>
                </h3>
                <div className="divide-y divide-slate-100">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Hostel Warden:</span>
                    <strong className="text-slate-900">{config.policeConfig.hostelManagerName}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Warden Mobile:</span>
                    <a href={`tel:${config.policeConfig.hostelManagerPhone}`} className="text-emerald-700 font-bold">{config.policeConfig.hostelManagerPhone}</a>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Police Helpline:</span>
                    <a href="tel:15" className="text-red-600 font-bold">15 (Rescue 15)</a>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Ambulance:</span>
                    <a href="tel:1122" className="text-emerald-700 font-bold">1122</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Booking Applications</h3>
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                + New Booking
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Room Type</th>
                    <th className="p-4">Allocated #</th>
                    <th className="p-4">Check-in Date</th>
                    <th className="p-4">Total (PKR)</th>
                    <th className="p-4">Booking Status</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="p-4 capitalize font-semibold">{b.roomTypeId}</td>
                      <td className="p-4 font-bold text-emerald-700">Room {b.assignedRoomNumber || b.preferredRoomNumber || 'TBD'}</td>
                      <td className="p-4">{b.checkInDate}</td>
                      <td className="p-4 font-bold">PKR {b.totalInitialPayment.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800">
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${b.paymentStatus === 'Payment Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => onViewBookingVoucher(b)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-black transition"
                        >
                          Voucher
                        </button>
                        {b.paymentStatus !== 'Payment Verified' && (
                          <button
                            onClick={() => onOpenPaymentModal(b)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                          >
                            Pay
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

        {/* TAB 3: PAYMENTS & INVOICES */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Payment Logs & Receipts</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Transaction ID (TID)</th>
                    <th className="p-4">Amount (PKR)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="p-4 font-mono">{p.bookingId}</td>
                      <td className="p-4 font-bold">{p.method}</td>
                      <td className="p-4 font-mono text-slate-700">{p.transactionId}</td>
                      <td className="p-4 font-bold">PKR {p.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${p.status === 'Payment Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{p.verifiedBy || 'Pending Reconciliation'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MY COMPLAINTS & POLICE TRACKING */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recorded Incidents & Tickets</h3>
                <p className="text-xs text-slate-500">Track internal investigation and official police reference statuses.</p>
              </div>
              <button
                onClick={onOpenComplaint}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs"
              >
                + File New Complaint
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onViewComplaintDetails(c)}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700">{c.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.severity === 'Emergency' ? 'bg-red-100 text-red-800' : c.severity === 'Serious' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {c.severity}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{c.category}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>

                  {c.policeReferenceNumber && (
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900">
                      <span className="font-bold block">Official Police Ref #: {c.policeReferenceNumber}</span>
                      <span>Assigned to: {c.policeStation || config.policeConfig.policeStation}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                    <span className="font-bold text-emerald-700">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
