import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  HostelConfig,
  Room,
  Facility,
  FoodConfig,
  HostelPolicyItem,
  HostelTimings,
  GalleryItem,
  Booking,
  Payment,
  Complaint,
  AuditLog,
  DashboardStats,
  FeeInvoice,
} from '../types';
import { api } from '../services/api';
import {
  initialHostelConfig,
  initialRooms,
  initialFacilities,
  initialFoodConfig,
  initialPolicies,
  initialTimings,
  initialGallery,
  initialBookings,
  initialPayments,
  initialComplaints,
  initialAuditLogs,
  initialFeeInvoices,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

interface HostelContextType {
  config: HostelConfig;
  rooms: Room[];
  facilities: Facility[];
  food: FoodConfig;
  policies: HostelPolicyItem[];
  timings: HostelTimings;
  gallery: GalleryItem[];
  bookings: Booking[];
  payments: Payment[];
  complaints: Complaint[];
  auditLogs: AuditLog[];
  stats: DashboardStats | null;
  loading: boolean;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  refreshAll: () => Promise<void>;
  updateHostelConfig: (updates: Partial<HostelConfig>, performedBy: string) => Promise<void>;
  createRoom: (room: Partial<Room>, performedBy: string) => Promise<Room>;
  updateRoom: (id: string, updates: Partial<Room>, performedBy: string) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
  createBooking: (booking: Partial<Booking>) => Promise<Booking>;
  updateBooking: (id: string, updates: Partial<Booking>, performedBy?: string) => Promise<Booking>;
  submitPayment: (payment: Partial<Payment>) => Promise<Payment>;
  verifyPayment: (id: string, status: Payment['status'], remarks: string, verifiedBy: string) => Promise<Payment>;
  submitComplaint: (complaint: Partial<Complaint> & { userIndicatedEmergency?: boolean }) => Promise<Complaint>;
  updateComplaint: (id: string, updates: Partial<Complaint>, performedBy?: string) => Promise<Complaint>;
  escalateToPolice: (id: string, performedBy: string, officerNotes?: string) => Promise<{ success: boolean; referenceNumber: string; policeStation: string }>;
  updateFacility: (id: string, updates: Partial<Facility>) => Promise<void>;
  updateFood: (updates: Partial<FoodConfig>) => Promise<void>;
  updatePolicies: (policies: HostelPolicyItem[]) => Promise<void>;
  updateTimings: (timings: Partial<HostelTimings>) => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  feeInvoices: FeeInvoice[];
  toggleRoomSeats: (id: string, seatsClosed: boolean, closedReason?: string, performedBy?: string) => Promise<Room>;
  createFeeInvoice: (invoice: Partial<FeeInvoice>) => Promise<FeeInvoice>;
  updateFeeInvoice: (id: string, updates: Partial<FeeInvoice>) => Promise<FeeInvoice>;
  payFeeInvoice: (id: string, amountPaid: number, paymentMethod: string, transactionReference?: string, notes?: string, recordedBy?: string) => Promise<FeeInvoice>;
  generateMonthlyBatchFees: (billingMonth: string, dueDate: string, performedBy?: string) => Promise<{ count: number }>;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<HostelConfig>(initialHostelConfig);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [food, setFood] = useState<FoodConfig>(initialFoodConfig);
  const [policies, setPolicies] = useState<HostelPolicyItem[]>(initialPolicies);
  const [timings, setTimings] = useState<HostelTimings>(initialTimings);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>(initialFeeInvoices);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message, timestamp: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [
        cfgRes,
        roomsRes,
        facRes,
        foodRes,
        polRes,
        timRes,
        galRes,
        bookRes,
        payRes,
        compRes,
        auditRes,
        statsRes,
        feeRes,
      ] = await Promise.all([
        api.getConfig(),
        api.getRooms(),
        api.getFacilities(),
        api.getFood(),
        api.getPolicies(),
        api.getTimings(),
        api.getGallery(),
        api.getBookings(),
        api.getPayments(),
        api.getComplaints(),
        api.getAuditLogs(),
        api.getStats(),
        api.getFees(),
      ]);

      setConfig(cfgRes);
      setRooms(roomsRes);
      setFacilities(facRes);
      setFood(foodRes);
      setPolicies(polRes);
      setTimings(timRes);
      setGallery(galRes);
      setBookings(bookRes);
      setPayments(payRes);
      setComplaints(compRes);
      setAuditLogs(auditRes);
      setStats(statsRes);
      if (feeRes) setFeeInvoices(feeRes);
    } catch (err) {
      console.warn('Initial data load warning:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const updateHostelConfig = async (updates: Partial<HostelConfig>, performedBy: string) => {
    const updated = await api.updateConfig(updates, performedBy);
    setConfig(updated);
    addToast('success', 'Hostel Details Updated', 'Hostel information, address, and policies saved successfully.');
    refreshAll();
  };

  const createRoom = async (roomData: Partial<Room>, performedBy: string) => {
    const newRoom = await api.createRoom(roomData, performedBy);
    setRooms((prev) => [...prev, newRoom]);
    addToast('success', 'Room Created', `Room ${newRoom.roomNumber} has been added to listing.`);
    refreshAll();
    return newRoom;
  };

  const updateRoom = async (id: string, updates: Partial<Room>, performedBy: string) => {
    const updated = await api.updateRoom(id, updates, performedBy);
    setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
    addToast('success', 'Room Updated', `Room ${updated.roomNumber} details updated.`);
    refreshAll();
    return updated;
  };

  const deleteRoom = async (id: string) => {
    await api.deleteRoom(id);
    setRooms((prev) => prev.filter((r) => r.id !== id));
    addToast('info', 'Room Removed', 'Room removed from inventory.');
    refreshAll();
  };

  const createBooking = async (bookingData: Partial<Booking>) => {
    const newBooking = await api.createBooking(bookingData);
    setBookings((prev) => [newBooking, ...prev]);
    addToast('success', 'Booking Application Received', `Booking ID ${newBooking.id} generated. Please proceed to payment upload.`);
    refreshAll();
    return newBooking;
  };

  const updateBooking = async (id: string, updates: Partial<Booking>, performedBy = 'Admin') => {
    const updated = await api.updateBooking(id, updates, performedBy);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    addToast('success', 'Booking Updated', `Booking ${updated.id} marked as ${updated.bookingStatus}.`);
    refreshAll();
    return updated;
  };

  const submitPayment = async (paymentData: Partial<Payment>) => {
    const newPayment = await api.submitPayment(paymentData);
    setPayments((prev) => [newPayment, ...prev]);
    addToast('success', 'Payment Proof Submitted', `TID ${newPayment.transactionId} received. Verification is now pending admin review.`);
    refreshAll();
    return newPayment;
  };

  const verifyPayment = async (id: string, status: Payment['status'], remarks: string, verifiedBy: string) => {
    const updated = await api.verifyPayment(id, status, remarks, verifiedBy);
    setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
    addToast('success', 'Payment Verification Processed', `Payment marked as ${status}. Resident status updated.`);
    refreshAll();
    return updated;
  };

  const submitComplaint = async (complaintData: Partial<Complaint> & { userIndicatedEmergency?: boolean }) => {
    const newComplaint = await api.submitComplaint(complaintData);
    setComplaints((prev) => [newComplaint, ...prev]);
    if (newComplaint.policeReferenceNumber) {
      addToast(
        'warning',
        'Official Police Reference Issued',
        `Complaint #${newComplaint.id} transmitted to ${newComplaint.policeStation}. Reference #${newComplaint.policeReferenceNumber}.`
      );
    } else {
      addToast(
        'success',
        'Complaint Submitted',
        `Complaint #${newComplaint.id} received. Category: ${newComplaint.category} (${newComplaint.severity}).`
      );
    }
    refreshAll();
    return newComplaint;
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>, performedBy = 'Admin') => {
    const updated = await api.updateComplaint(id, updates, performedBy);
    setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
    addToast('info', 'Complaint Updated', `Complaint #${updated.id} status changed to ${updated.status}.`);
    refreshAll();
    return updated;
  };

  const escalateToPolice = async (id: string, performedBy: string, officerNotes?: string) => {
    const result = await api.escalateToPolice(id, performedBy, officerNotes);
    addToast(
      'warning',
      'Law Enforcement Escalation Successful',
      `Transmitted to ${result.policeStation}. Reference Allocated: ${result.referenceNumber}`
    );
    refreshAll();
    return result;
  };

  const updateFacility = async (id: string, updates: Partial<Facility>) => {
    const updated = await api.updateFacility(id, updates);
    setFacilities((prev) => prev.map((f) => (f.id === id ? updated : f)));
    addToast('success', 'Facility Updated', `${updated.name} settings updated.`);
    refreshAll();
  };

  const updateFood = async (updates: Partial<FoodConfig>) => {
    const updated = await api.updateFood(updates);
    setFood(updated);
    addToast('success', 'Food Menu & Pricing Updated', 'Mess timings, prices, and weekly menu updated.');
    refreshAll();
  };

  const updatePolicies = async (newPolicies: HostelPolicyItem[]) => {
    const updated = await api.updatePolicies(newPolicies);
    setPolicies(updated);
    addToast('success', 'Hostel Policies Updated', 'Rules and regulations saved.');
    refreshAll();
  };

  const updateTimings = async (newTimings: Partial<HostelTimings>) => {
    const updated = await api.updateTimings(newTimings);
    setTimings(updated);
    addToast('success', 'Hostel Timings Updated', 'Gate, quiet, and meal hours updated.');
    refreshAll();
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const created = await api.addGalleryItem(item);
    setGallery((prev) => [...prev, created]);
    addToast('success', 'Gallery Updated', `Added photo: ${created.title}`);
    refreshAll();
  };

  const deleteGalleryItem = async (id: string) => {
    await api.deleteGalleryItem(id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
    addToast('info', 'Photo Deleted', 'Image removed from gallery.');
    refreshAll();
  };

  const toggleRoomSeats = async (id: string, seatsClosed: boolean, closedReason = '', performedBy = 'Admin') => {
    const updated = await api.toggleRoomSeats(id, seatsClosed, closedReason, performedBy);
    setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
    addToast(
      seatsClosed ? 'warning' : 'success',
      seatsClosed ? 'Room Admissions Closed' : 'Room Seats Reopened',
      `Room ${updated.roomNumber} admissions are now ${seatsClosed ? 'CLOSED / LOCKED' : 'OPEN for booking'}.`
    );
    refreshAll();
    return updated;
  };

  const createFeeInvoice = async (invoiceData: Partial<FeeInvoice>) => {
    const created = await api.createFeeInvoice(invoiceData);
    setFeeInvoices((prev) => [created, ...prev]);
    addToast('success', 'Fee Invoice Generated', `Invoice ${created.id} created for ${created.residentName}. Total: PKR ${created.totalPayable.toLocaleString()}.`);
    refreshAll();
    return created;
  };

  const updateFeeInvoice = async (id: string, updates: Partial<FeeInvoice>) => {
    const updated = await api.updateFeeInvoice(id, updates);
    setFeeInvoices((prev) => prev.map((f) => (f.id === id ? updated : f)));
    addToast('info', 'Invoice Updated', `Fee record ${updated.id} updated.`);
    refreshAll();
    return updated;
  };

  const payFeeInvoice = async (id: string, amountPaid: number, paymentMethod: string, transactionReference?: string, notes?: string, recordedBy = 'Admin') => {
    const updated = await api.payFeeInvoice(id, amountPaid, paymentMethod, transactionReference, notes, recordedBy);
    setFeeInvoices((prev) => prev.map((f) => (f.id === id ? updated : f)));
    addToast('success', 'Fee Payment Recorded', `Received PKR ${amountPaid.toLocaleString()} from ${updated.residentName}. Receipt #${updated.receiptNumber}.`);
    refreshAll();
    return updated;
  };

  const generateMonthlyBatchFees = async (billingMonth: string, dueDate: string, performedBy = 'Admin') => {
    const res = await api.generateMonthlyBatchFees(billingMonth, dueDate, performedBy);
    addToast('success', 'Monthly Fee Invoices Generated', `Successfully generated ${res.count} invoices for ${billingMonth}.`);
    refreshAll();
    return { count: res.count };
  };

  return (
    <HostelContext.Provider
      value={{
        config,
        rooms,
        facilities,
        food,
        policies,
        timings,
        gallery,
        bookings,
        payments,
        complaints,
        auditLogs,
        stats,
        loading,
        toasts,
        feeInvoices,
        addToast,
        removeToast,
        refreshAll,
        updateHostelConfig,
        createRoom,
        updateRoom,
        deleteRoom,
        toggleRoomSeats,
        createBooking,
        updateBooking,
        submitPayment,
        verifyPayment,
        submitComplaint,
        updateComplaint,
        escalateToPolice,
        updateFacility,
        updateFood,
        updatePolicies,
        updateTimings,
        addGalleryItem,
        deleteGalleryItem,
        createFeeInvoice,
        updateFeeInvoice,
        payFeeInvoice,
        generateMonthlyBatchFees,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
