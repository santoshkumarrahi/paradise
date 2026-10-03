import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { Booking } from '../../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onProceedToPayment?: (booking: Booking) => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onProceedToPayment,
}) => {
  const { config } = useHostel();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'Confirmed':
      case 'Checked In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Under Verification':
      case 'Payment Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const shareText = `*PakHostel Booking Voucher*\nBooking ID: ${booking.id}\nResident: ${booking.residentName}\nRoom: ${booking.roomTypeId} (Room #${booking.assignedRoomNumber || booking.preferredRoomNumber || 'TBD'})\nTotal Initial: PKR ${booking.totalInitialPayment.toLocaleString()}\nStatus: ${booking.bookingStatus}\nHostel: ${config.name}, ${config.city}\nPhone: ${config.phone}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Actions Topbar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base">Hostel Booking Slip & Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Print Voucher"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Share via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body (Section 22 fields) */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-white text-slate-800">
          {/* Hostel Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">{config.name}</h3>
                <p className="text-xs text-slate-500">{config.address}, {config.area}, {config.city}, Pakistan</p>
                <p className="text-xs text-slate-500">Contact: {config.phone} • {config.email}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Official Booking ID</span>
              <span className="font-mono text-lg font-black text-emerald-700">{booking.id}</span>
              <div className="mt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(booking.bookingStatus)}`}>
                  {booking.bookingStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Resident Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Resident Name:</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.residentName}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Father / Guardian:</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.fatherGuardianName || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">CNIC / B-Form:</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{booking.cnic}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Mobile Phone:</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.phone}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Email:</span>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{booking.email}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Emergency Contact:</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.emergencyContactNumber}</p>
            </div>
          </div>

          {/* Room & Allocation Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-y border-slate-100 py-4">
            <div>
              <span className="text-slate-500">Room Category:</span>
              <p className="font-bold text-slate-900 capitalize text-sm">{booking.roomTypeId}</p>
            </div>
            <div>
              <span className="text-slate-500">Allocated Room #:</span>
              <p className="font-bold text-emerald-700 text-sm">
                Room {booking.assignedRoomNumber || booking.preferredRoomNumber || 'Pending Allocation'}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Check-in Date:</span>
              <p className="font-bold text-slate-900 text-sm">{booking.checkInDate}</p>
            </div>
            <div>
              <span className="text-slate-500">Stay Duration:</span>
              <p className="font-bold text-slate-900 text-sm">{booking.stayDurationMonths} Months</p>
            </div>
          </div>

          {/* Financial Breakdown (Section 22) */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Fee Schedule & Breakdown</h4>
            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              <div className="p-3 flex justify-between">
                <span className="text-slate-600">Monthly Room Rent:</span>
                <span className="font-semibold text-slate-900">PKR {booking.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-600">Refundable Security Deposit:</span>
                <span className="font-semibold text-slate-900">PKR {booking.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-600">Food / Mess Package ({booking.foodPackageType}):</span>
                <span className="font-semibold text-slate-900">PKR {booking.foodCharges.toLocaleString()}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-600">Admission / Verification Fee:</span>
                <span className="font-semibold text-slate-900">PKR {booking.otherCharges.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-900 text-white flex justify-between font-bold text-sm">
                <span>Total Initial Payable:</span>
                <span className="text-emerald-400">PKR {booking.totalInitialPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Status Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Payment Reconciliation Status:</span>
              <span className="font-bold text-slate-900 text-sm">{booking.paymentStatus}</span>
            </div>

            {booking.paymentStatus !== 'Payment Verified' && onProceedToPayment && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToPayment(booking);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Submit JazzCash / Easypaisa Proof</span>
              </button>
            )}
          </div>

          {/* Official Verification QR & Rules notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Instructions for Key Handover & Check-in:</p>
              <p className="mt-0.5">
                Present this voucher along with your original CNIC and University Student Card at the hostel reception desk on your check-in date ({booking.checkInDate}). Physical keys and biometric access enrollment will be issued upon payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
