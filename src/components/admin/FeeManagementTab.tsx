import React, { useState } from 'react';
import {
  CreditCard,
  CalendarCheck,
  Search,
  Filter,
  DollarSign,
  Plus,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Building,
  Edit,
  X,
  FileText,
  AlertTriangle,
  Send,
  MessageSquare,
  Copy,
  Check,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { FeeInvoice, FeeStatus, PaymentMethod } from '../../types';

export const FeeManagementTab: React.FC = () => {
  const {
    config,
    bookings,
    feeInvoices,
    rooms,
    food,
    createFeeInvoice,
    updateFeeInvoice,
    payFeeInvoice,
    generateMonthlyBatchFees,
  } = useHostel();

  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchMonth, setBatchMonth] = useState('October 2026');
  const [batchDueDate, setBatchDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [selectedResidentBookingId, setSelectedResidentBookingId] = useState('');
  const [newInvoiceMonth, setNewInvoiceMonth] = useState('October 2026');
  const [newInvoiceRent, setNewInvoiceRent] = useState(20000);
  const [newInvoiceFood, setNewInvoiceFood] = useState(14000);
  const [newInvoiceUtility, setNewInvoiceUtility] = useState(2000);
  const [newInvoiceLateFee, setNewInvoiceLateFee] = useState(0);
  const [newInvoiceDiscount, setNewInvoiceDiscount] = useState(0);
  const [newInvoiceDueDate, setNewInvoiceDueDate] = useState('2026-10-10');

  // Payment recording modal
  const [recordingInvoice, setRecordingInvoice] = useState<FeeInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | 'Cash'>('Cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // 3-Copy Challan modal
  const [challanInvoice, setChallanInvoice] = useState<FeeInvoice | null>(null);

  // Active residents from confirmed/checked-in bookings
  const activeResidents = bookings.filter(
    (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In'
  );

  // Filter invoices
  const filteredInvoices = feeInvoices.filter((inv) => {
    const matchesSearch =
      inv.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalInvoiced = feeInvoices.reduce((sum, inv) => sum + inv.totalPayable, 0);
  const totalCollected = feeInvoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalOutstanding = feeInvoices.reduce((sum, inv) => sum + inv.remainingBalance, 0);
  const overdueCount = feeInvoices.filter((inv) => inv.status === 'Overdue').length;

  // Handle batch generation
  const handleBatchGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateMonthlyBatchFees(batchMonth, batchDueDate, currentUser?.name);
    setIsBatchModalOpen(false);
  };

  // Handle new invoice
  const handleCreateNewInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const residentBooking = bookings.find((b) => b.id === selectedResidentBookingId) || bookings[0];
    if (!residentBooking) return;

    await createFeeInvoice({
      bookingId: residentBooking.id,
      residentId: residentBooking.userId,
      residentName: residentBooking.residentName,
      phone: residentBooking.phone,
      roomNumber: residentBooking.assignedRoomNumber || residentBooking.preferredRoomNumber || '201',
      roomType: residentBooking.roomTypeId,
      billingMonth: newInvoiceMonth,
      dueDate: newInvoiceDueDate,
      roomRent: Number(newInvoiceRent),
      foodCharges: Number(newInvoiceFood),
      utilityCharges: Number(newInvoiceUtility),
      lateFee: Number(newInvoiceLateFee),
      discount: Number(newInvoiceDiscount),
      status: 'Pending',
    });

    setIsNewInvoiceModalOpen(false);
  };

  // Handle recording fee payment
  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingInvoice) return;
    await payFeeInvoice(
      recordingInvoice.id,
      paymentAmount || recordingInvoice.remainingBalance,
      paymentMethod,
      transactionRef,
      paymentNotes,
      currentUser?.name || 'Hostel Accounts Officer'
    );
    setRecordingInvoice(null);
  };

  const getStatusBadge = (status: FeeStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Partially Paid':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const generateWhatsAppReminder = (inv: FeeInvoice) => {
    const text = `Assalam-o-Alaikum ${inv.residentName},\nThis is an official fee reminder from *${config.name}* Accounts.\n\n*Invoice ID:* ${inv.id}\n*Billing Month:* ${inv.billingMonth}\n*Room Number:* ${inv.roomNumber}\n*Total Dues:* PKR ${inv.totalPayable.toLocaleString()}\n*Amount Paid:* PKR ${inv.amountPaid.toLocaleString()}\n*Outstanding Balance:* PKR ${inv.remainingBalance.toLocaleString()}\n*Due Date:* ${inv.dueDate}\n\nPlease remit payment via:\n- *JazzCash:* ${config.paymentAccounts.jazzCash.accountNumber} (${config.paymentAccounts.jazzCash.accountTitle})\n- *Easypaisa:* ${config.paymentAccounts.easypaisa.accountNumber}\n- *Bank IBFT:* ${config.paymentAccounts.bankTransfer.bankName} - IBAN: ${config.paymentAccounts.bankTransfer.iban}\n\nThank you.`;
    return `https://wa.me/${inv.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4 Financial Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Invoiced</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            PKR {totalInvoiced.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Cumulative resident billings</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Collected</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            PKR {totalCollected.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Reconciled in bank & cash accounts</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Outstanding Arrears</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            PKR {totalOutstanding.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Pending & overdue rent</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Overdue Accounts</span>
          <p className="text-2xl font-black text-red-600 mt-1">
            {overdueCount} Defaulter{overdueCount !== 1 ? 's' : ''}
          </p>
          <span className="text-[11px] text-red-600 mt-1 block font-medium">Past due date (Late fines active)</span>
        </div>
      </div>

      {/* Official Monthly Fee Tariff Matrix */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-sm text-white">Active Hostel Fee Structure (Monthly Tariffs)</span>
          </div>
          <span className="text-[11px] text-slate-300">All prices in PKR • Managed by Hostel Admin</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">1-Seater Rent</span>
            <strong className="text-sm font-black text-white font-mono">
              PKR {(rooms.find(r => r.roomType === '1-seater')?.monthlyRent || 32000).toLocaleString()}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">2-Seater Rent</span>
            <strong className="text-sm font-black text-emerald-400 font-mono">
              PKR {(rooms.find(r => r.roomType === '2-seater')?.monthlyRent || 22000).toLocaleString()}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">3-Seater Rent</span>
            <strong className="text-sm font-black text-white font-mono">
              PKR {(rooms.find(r => r.roomType === '3-seater')?.monthlyRent || 17000).toLocaleString()}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">4-Seater Rent</span>
            <strong className="text-sm font-black text-white font-mono">
              PKR {(rooms.find(r => r.roomType === '4-seater')?.monthlyRent || 14000).toLocaleString()}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-amber-300 uppercase font-semibold block">Mess (3 Meals)</span>
            <strong className="text-sm font-black text-amber-300 font-mono">
              PKR {food.monthlyPackagePrice.toLocaleString()}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-sky-300 uppercase font-semibold block">Generator & Power</span>
            <strong className="text-sm font-black text-sky-300 font-mono">
              PKR 2,000
            </strong>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Resident Fee & Rent Invoices</h3>
            <p className="text-xs text-slate-500">
              Manage room rent, food mess charges, utility bills, late fines, student discounts, and cash receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Generate Monthly Batch Dues</span>
            </button>

            <button
              onClick={() => {
                if (activeResidents.length > 0) {
                  setSelectedResidentBookingId(activeResidents[0].id);
                  setNewInvoiceRent(activeResidents[0].monthlyRent);
                  setNewInvoiceFood(activeResidents[0].foodCharges || 0);
                }
                setIsNewInvoiceModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Invoice</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resident name, room # or invoice ID..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-400 font-medium">Status:</span>
            {['All', 'Pending', 'Overdue', 'Paid', 'Partially Paid'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Resident & Room</th>
                <th className="p-3.5">Month</th>
                <th className="p-3.5">Breakdown (Rent + Food + Util)</th>
                <th className="p-3.5">Total Dues</th>
                <th className="p-3.5">Paid</th>
                <th className="p-3.5">Remaining</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Fee Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{inv.id}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{inv.residentName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Room {inv.roomNumber} ({inv.roomType}) • {inv.phone}
                    </p>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{inv.billingMonth}</td>
                  <td className="p-3.5 text-[11px] text-slate-600">
                    <span>Rent: PKR {inv.roomRent.toLocaleString()}</span>
                    {inv.foodCharges > 0 && <span className="block text-amber-700 font-medium">+ Mess: PKR {inv.foodCharges.toLocaleString()}</span>}
                    {inv.lateFee > 0 && <span className="block text-red-600 font-semibold">+ Fine: PKR {inv.lateFee.toLocaleString()}</span>}
                    {inv.discount > 0 && <span className="block text-emerald-700 font-medium">- Disc: PKR {inv.discount.toLocaleString()}</span>}
                  </td>
                  <td className="p-3.5 font-black text-slate-900">
                    PKR {inv.totalPayable.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700">
                    PKR {inv.amountPaid.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-bold text-amber-800">
                    PKR {inv.remainingBalance.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                    {/* Record Payment Button */}
                    {inv.remainingBalance > 0 && (
                      <button
                        onClick={() => {
                          setRecordingInvoice(inv);
                          setPaymentAmount(inv.remainingBalance);
                          setTransactionRef(`REC-${Date.now().toString().slice(-4)}`);
                          setPaymentNotes('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        title="Record Payment"
                      >
                        Receive Fee
                      </button>
                    )}

                    {/* Print 3-Copy Bank Challan */}
                    <button
                      onClick={() => setChallanInvoice(inv)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Print 3-Copy Fee Challan"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    {/* WhatsApp Reminder Link */}
                    {inv.remainingBalance > 0 && (
                      <a
                        href={generateWhatsAppReminder(inv)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 inline-block transition"
                        title="Send WhatsApp Fee Reminder"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: BATCH GENERATE MONTHLY DUES */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Generate Monthly Batch Invoices</h3>
              </div>
              <button onClick={() => setIsBatchModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchGenerate} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                This will automatically generate monthly rent, mess dues, and utility challans for all <strong>{activeResidents.length} currently active residents</strong>.
              </p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Billing Month *</label>
                <input
                  type="text"
                  required
                  value={batchMonth}
                  onChange={(e) => setBatchMonth(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Due Date for Payment *</label>
                <input
                  type="date"
                  required
                  value={batchDueDate}
                  onChange={(e) => setBatchDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Per hostel policy, a late fine of PKR 200/day applies after this date.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold"
                >
                  Generate All Challans
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE SINGLE CUSTOM INVOICE */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">Create Custom Fee Challan</h3>
              <button onClick={() => setIsNewInvoiceModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewInvoice} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Resident *</label>
                <select
                  value={selectedResidentBookingId}
                  onChange={(e) => {
                    setSelectedResidentBookingId(e.target.value);
                    const b = bookings.find((item) => item.id === e.target.value);
                    if (b) {
                      setNewInvoiceRent(b.monthlyRent);
                      setNewInvoiceFood(b.foodCharges || 0);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                >
                  {activeResidents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.residentName} (Room {r.assignedRoomNumber || '201'} • {r.roomTypeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Billing Month</label>
                  <input
                    type="text"
                    value={newInvoiceMonth}
                    onChange={(e) => setNewInvoiceMonth(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={newInvoiceDueDate}
                    onChange={(e) => setNewInvoiceDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Room Rent (PKR)</label>
                  <input
                    type="number"
                    value={newInvoiceRent}
                    onChange={(e) => setNewInvoiceRent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mess Food (PKR)</label>
                  <input
                    type="number"
                    value={newInvoiceFood}
                    onChange={(e) => setNewInvoiceFood(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Utilities (PKR)</label>
                  <input
                    type="number"
                    value={newInvoiceUtility}
                    onChange={(e) => setNewInvoiceUtility(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Late Fee / Arrears (PKR)</label>
                  <input
                    type="number"
                    value={newInvoiceLateFee}
                    onChange={(e) => setNewInvoiceLateFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-red-600 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Discount / Waiver (PKR)</label>
                  <input
                    type="number"
                    value={newInvoiceDiscount}
                    onChange={(e) => setNewInvoiceDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-emerald-700 font-bold"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
                <span className="font-bold">Total Net Payable:</span>
                <span className="text-base font-black text-emerald-400">
                  PKR {(newInvoiceRent + newInvoiceFood + newInvoiceUtility + newInvoiceLateFee - newInvoiceDiscount).toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD FEE PAYMENT */}
      {recordingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Record Fee Payment</h3>
              </div>
              <button onClick={() => setRecordingInvoice(null)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Resident:</span>
                  <strong className="text-slate-900">{recordingInvoice.residentName} (Room {recordingInvoice.roomNumber})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Month:</span>
                  <strong className="text-slate-900">{recordingInvoice.billingMonth}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Dues:</span>
                  <strong className="text-slate-900">PKR {recordingInvoice.totalPayable.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span className="font-medium">Remaining Balance:</span>
                  <strong className="font-black text-sm">PKR {recordingInvoice.remainingBalance.toLocaleString()}</strong>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Amount Received (PKR) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-emerald-700 text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="Cash">Cash (Received at Reception Desk)</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Bank Transfer">Meezan Bank 1Link IBFT</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Transaction Ref / Slip #</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. Cash Receipt #42 or JazzCash TID"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Internal Notes</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Paid in full by student"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRecordingInvoice(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: 3-COPY PRINTABLE OFFICIAL PAKISTANI BANK FEE CHALLAN */}
      {challanInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">Official 3-Copy Hostel Fee Challan</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Challan</span>
                </button>
                <button onClick={() => setChallanInvoice(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3-Copy Body (Student Copy, Hostel Copy, Bank Copy) */}
            <div className="p-6 overflow-x-auto bg-white text-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-dashed divide-slate-300 min-w-[760px]">
                {['STUDENT COPY', 'HOSTEL ACCOUNTS COPY', 'BANK / CASHIER COPY'].map((copyType, idx) => (
                  <div key={idx} className={`${idx > 0 ? 'md:pl-6 pt-6 md:pt-0' : ''} space-y-3 text-[11px]`}>
                    {/* Header */}
                    <div className="text-center border-b border-slate-200 pb-2">
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {copyType}
                      </span>
                      <h4 className="font-black text-slate-900 text-xs mt-1">{config.name}</h4>
                      <p className="text-[10px] text-slate-500">{config.area}, {config.city}</p>
                    </div>

                    {/* Challan & Resident Details */}
                    <div className="space-y-1 border-b border-slate-100 pb-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Challan #:</span>
                        <strong className="font-mono">{challanInvoice.id}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Billing Month:</span>
                        <strong>{challanInvoice.billingMonth}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Resident:</span>
                        <strong>{challanInvoice.residentName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Room / Bed:</span>
                        <strong>Room {challanInvoice.roomNumber} ({challanInvoice.roomType})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Due Date:</span>
                        <strong className="text-red-700">{challanInvoice.dueDate}</strong>
                      </div>
                    </div>

                    {/* Fee Particulars */}
                    <div className="space-y-1 border-b border-slate-200 pb-2">
                      <div className="flex justify-between">
                        <span>Room Rent:</span>
                        <span>PKR {challanInvoice.roomRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Food / Mess:</span>
                        <span>PKR {challanInvoice.foodCharges.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilities & Generator:</span>
                        <span>PKR {challanInvoice.utilityCharges.toLocaleString()}</span>
                      </div>
                      {challanInvoice.lateFee > 0 && (
                        <div className="flex justify-between text-red-600 font-semibold">
                          <span>Late Fee Surcharge:</span>
                          <span>+PKR {challanInvoice.lateFee.toLocaleString()}</span>
                        </div>
                      )}
                      {challanInvoice.discount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Waiver / Discount:</span>
                          <span>-PKR {challanInvoice.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="pt-1 border-t border-slate-200 flex justify-between font-black text-xs text-slate-900">
                        <span>Net Payable:</span>
                        <span className="text-emerald-700">PKR {challanInvoice.totalPayable.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Bank & Remittance info */}
                    <div className="p-2 rounded-xl bg-slate-50 text-[10px] space-y-0.5 text-slate-600">
                      <p><strong>Bank:</strong> {config.paymentAccounts.bankTransfer.bankName}</p>
                      <p><strong>IBAN:</strong> {config.paymentAccounts.bankTransfer.iban}</p>
                      <p><strong>JazzCash/Easypaisa:</strong> {config.paymentAccounts.jazzCash.accountNumber}</p>
                    </div>

                    {/* Signatures */}
                    <div className="pt-4 flex justify-between items-end text-[9px] text-slate-400">
                      <div className="text-center">
                        <div className="w-16 border-b border-slate-400 mb-0.5"></div>
                        <span>Student Sign</span>
                      </div>
                      <div className="text-center">
                        <div className="w-16 border-b border-slate-400 mb-0.5"></div>
                        <span>Officer Stamp</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
