import {
  HostelConfig,
  Room,
  Facility,
  FoodConfig,
  HostelPolicyItem,
  HostelTimings,
  GalleryItem,
  User,
  Booking,
  Payment,
  Complaint,
  AuditLog,
  DashboardStats,
  ContactMessage,
  FeeInvoice,
} from '../types';
import {
  initialHostelConfig,
  initialRooms,
  initialFacilities,
  initialFoodConfig,
  initialPolicies,
  initialTimings,
  initialGallery,
  initialUsers,
  initialBookings,
  initialPayments,
  initialComplaints,
  initialAuditLogs,
  initialFeeInvoices,
} from '../data/initialData';

// Fallback local storage key
const STORAGE_PREFIX = 'pakhostel_';

function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Helper to make API calls with graceful fallback
async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: () => T): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (res.ok) {
      return (await res.json()) as T;
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Request failed with status ${res.status}`);
  } catch (err) {
    if (fallbackData) {
      return fallbackData();
    }
    throw err;
  }
}

export const api = {
  // STATS
  async getStats(): Promise<DashboardStats> {
    return fetchWithFallback('/api/stats', undefined, () => {
      const rooms = getLocal('rooms', initialRooms);
      const bookings = getLocal('bookings', initialBookings);
      const payments = getLocal('payments', initialPayments);
      const complaints = getLocal('complaints', initialComplaints);

      return {
        totalRooms: rooms.length,
        availableRooms: rooms.filter((r) => r.status === 'Available').length,
        occupiedRooms: rooms.filter((r) => r.status === 'Occupied').length,
        maintenanceRooms: rooms.filter((r) => r.status === 'Maintenance').length,
        totalResidents: bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length,
        pendingBookings: bookings.filter((b) => b.bookingStatus === 'Pending' || b.bookingStatus === 'Under Verification').length,
        confirmedBookings: bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length,
        pendingPayments: payments.filter((p) => p.status === 'Verification Pending').length,
        verifiedPayments: payments.filter((p) => p.status === 'Payment Verified').length,
        totalRevenuePKR: payments
          .filter((p) => p.status === 'Payment Verified')
          .reduce((sum, p) => sum + p.amount, 0),
        pendingComplaints: complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'In Progress').length,
        seriousComplaints: complaints.filter((c) => c.severity === 'Serious').length,
        emergencyComplaints: complaints.filter((c) => c.severity === 'Emergency').length,
        resolvedComplaints: complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length,
        policeEscalations: complaints.filter((c) => c.policeReferenceNumber && c.policeReferenceNumber.length > 0).length,
      };
    });
  },

  // CONFIG
  async getConfig(): Promise<HostelConfig> {
    return fetchWithFallback('/api/hostel/config', undefined, () => getLocal('config', initialHostelConfig));
  },

  async updateConfig(config: Partial<HostelConfig>, updatedBy: string): Promise<HostelConfig> {
    return fetchWithFallback(
      '/api/hostel/config',
      {
        method: 'PUT',
        body: JSON.stringify({ ...config, updatedBy }),
      },
      () => {
        const cur = getLocal('config', initialHostelConfig);
        const updated = { ...cur, ...config };
        setLocal('config', updated);
        this.addAuditLog('Updated Hostel Configuration', 'HostelConfig', cur.id, updatedBy, 'Super Admin', 'Updated master configuration');
        return updated;
      }
    );
  },

  // ROOMS
  async getRooms(): Promise<Room[]> {
    return fetchWithFallback('/api/rooms', undefined, () => getLocal('rooms', initialRooms));
  },

  async createRoom(room: Partial<Room>, performedBy: string): Promise<Room> {
    return fetchWithFallback(
      '/api/rooms',
      {
        method: 'POST',
        body: JSON.stringify({ ...room, performedBy }),
      },
      () => {
        const rooms = getLocal('rooms', initialRooms);
        const newRoom: Room = {
          id: `room-${Date.now().toString().slice(-4)}`,
          roomNumber: room.roomNumber || '103',
          roomType: room.roomType || '2-seater',
          floor: room.floor || '1st Floor',
          capacity: room.capacity || 2,
          totalBeds: room.totalBeds || 2,
          occupiedBeds: room.occupiedBeds || 0,
          monthlyRent: room.monthlyRent || 20000,
          securityDeposit: room.securityDeposit || 10000,
          status: room.status || 'Available',
          attachedWashroom: room.attachedWashroom ?? true,
          balcony: room.balcony ?? false,
          hasAC: room.hasAC ?? false,
          amenities: room.amenities || ['Bed', 'Study Table', 'Wardrobe'],
          images: room.images || ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'],
          description: room.description || 'Modern furnished student accommodation room.',
        };
        rooms.push(newRoom);
        setLocal('rooms', rooms);
        this.addAuditLog('Created Room', 'Room', newRoom.id, performedBy, 'Hostel Admin', `Created Room ${newRoom.roomNumber}`);
        return newRoom;
      }
    );
  },

  async updateRoom(id: string, room: Partial<Room>, performedBy: string): Promise<Room> {
    return fetchWithFallback(
      `/api/rooms/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ ...room, performedBy }),
      },
      () => {
        const rooms = getLocal('rooms', initialRooms);
        const idx = rooms.findIndex((r) => r.id === id);
        if (idx !== -1) {
          rooms[idx] = { ...rooms[idx], ...room };
          setLocal('rooms', rooms);
          this.addAuditLog('Updated Room', 'Room', id, performedBy, 'Hostel Admin', `Updated Room ${rooms[idx].roomNumber}`);
          return rooms[idx];
        }
        throw new Error('Room not found');
      }
    );
  },

  async deleteRoom(id: string): Promise<{ success: boolean }> {
    return fetchWithFallback(
      `/api/rooms/${id}`,
      { method: 'DELETE' },
      () => {
        const rooms = getLocal('rooms', initialRooms);
        const filtered = rooms.filter((r) => r.id !== id);
        setLocal('rooms', filtered);
        this.addAuditLog('Deleted Room', 'Room', id, 'Admin', 'Super Admin', 'Deleted room from system');
        return { success: true };
      }
    );
  },

  async toggleRoomSeats(id: string, seatsClosed: boolean, closedReason: string, performedBy: string): Promise<Room> {
    return fetchWithFallback(
      `/api/rooms/${id}/toggle-seats`,
      {
        method: 'POST',
        body: JSON.stringify({ seatsClosed, closedReason, performedBy }),
      },
      () => {
        const rooms = getLocal('rooms', initialRooms);
        const r = rooms.find((room) => room.id === id);
        if (!r) throw new Error('Room not found');
        r.seatsClosed = seatsClosed;
        r.closedReason = closedReason;
        if (seatsClosed) {
          if (r.status === 'Available') r.status = 'Unavailable';
        } else {
          if (r.occupiedBeds < r.totalBeds) r.status = 'Available';
        }
        setLocal('rooms', rooms);
        this.addAuditLog(
          seatsClosed ? 'Room Seats Closed' : 'Room Seats Opened',
          'Room',
          id,
          performedBy,
          'Hostel Admin',
          `${seatsClosed ? 'Closed admissions' : 'Reopened seats'} for Room ${r.roomNumber}. Reason: ${closedReason || 'Admin decision'}`
        );
        return r;
      }
    );
  },

  // BOOKINGS
  async getBookings(userId?: string): Promise<Booking[]> {
    const url = userId ? `/api/bookings?userId=${userId}` : '/api/bookings';
    return fetchWithFallback(url, undefined, () => {
      const bookings = getLocal('bookings', initialBookings);
      return userId ? bookings.filter((b) => b.userId === userId) : bookings;
    });
  },

  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    return fetchWithFallback(
      '/api/bookings',
      {
        method: 'POST',
        body: JSON.stringify(booking),
      },
      () => {
        const bookings = getLocal('bookings', initialBookings);
        const rooms = getLocal('rooms', initialRooms);

        const newBooking: Booking = {
          id: `BK-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: booking.userId || 'usr-std-1',
          residentName: booking.residentName || 'Student',
          fatherGuardianName: booking.fatherGuardianName || '',
          cnic: booking.cnic || '35201-0000000-1',
          dob: booking.dob || '2000-01-01',
          gender: booking.gender || 'Male',
          phone: booking.phone || '',
          whatsapp: booking.whatsapp || booking.phone || '',
          email: booking.email || '',
          permanentAddress: booking.permanentAddress || '',
          emergencyContactName: booking.emergencyContactName || '',
          emergencyContactNumber: booking.emergencyContactNumber || '',
          studentWorkerStatus: booking.studentWorkerStatus || 'Student',
          instituteCompany: booking.instituteCompany || '',
          roomTypeId: booking.roomTypeId || '2-seater',
          preferredRoomNumber: booking.preferredRoomNumber,
          assignedRoomNumber: booking.preferredRoomNumber || '101',
          checkInDate: booking.checkInDate || new Date().toISOString().split('T')[0],
          stayDurationMonths: booking.stayDurationMonths || 6,
          numberOfPersons: booking.numberOfPersons || 1,
          foodRequired: !!booking.foodRequired,
          foodPackageType: booking.foodPackageType || 'None',
          specialRequirements: booking.specialRequirements,
          monthlyRent: booking.monthlyRent || 20000,
          securityDeposit: booking.securityDeposit || 10000,
          foodCharges: booking.foodCharges || 0,
          otherCharges: booking.otherCharges || 1000,
          totalInitialPayment: booking.totalInitialPayment || 31000,
          acceptedPolicies: true,
          bookingStatus: 'Payment Pending',
          paymentStatus: 'Unpaid',
          createdAt: new Date().toISOString(),
          notes: 'Awaiting payment verification.',
        };
        bookings.unshift(newBooking);
        setLocal('bookings', bookings);
        this.addAuditLog('Created Booking', 'Booking', newBooking.id, newBooking.residentName, 'Student/Resident', `Submitted application for ${newBooking.roomTypeId}`);
        return newBooking;
      }
    );
  },

  async updateBooking(id: string, updates: Partial<Booking>, performedBy = 'Admin'): Promise<Booking> {
    return fetchWithFallback(
      `/api/bookings/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ ...updates, performedBy }),
      },
      () => {
        const bookings = getLocal('bookings', initialBookings);
        const idx = bookings.findIndex((b) => b.id === id);
        if (idx !== -1) {
          bookings[idx] = { ...bookings[idx], ...updates };
          setLocal('bookings', bookings);
          this.addAuditLog('Updated Booking', 'Booking', id, performedBy, 'Hostel Admin', `Updated booking status to ${updates.bookingStatus || 'current'}`);
          return bookings[idx];
        }
        throw new Error('Booking not found');
      }
    );
  },

  // PAYMENTS
  async getPayments(userId?: string): Promise<Payment[]> {
    const url = userId ? `/api/payments?userId=${userId}` : '/api/payments';
    return fetchWithFallback(url, undefined, () => {
      const payments = getLocal('payments', initialPayments);
      return userId ? payments.filter((p) => p.userId === userId) : payments;
    });
  },

  async submitPayment(paymentData: Partial<Payment>): Promise<Payment> {
    return fetchWithFallback(
      '/api/payments',
      {
        method: 'POST',
        body: JSON.stringify(paymentData),
      },
      () => {
        const payments = getLocal('payments', initialPayments);
        const newPayment: Payment = {
          id: `PAY-${(paymentData.method || 'JC').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
          bookingId: paymentData.bookingId || '',
          userId: paymentData.userId || 'usr-std-1',
          residentName: paymentData.residentName || 'Resident',
          amount: paymentData.amount || 0,
          currency: 'PKR',
          method: paymentData.method || 'JazzCash',
          transactionId: paymentData.transactionId || '',
          senderAccountTitle: paymentData.senderAccountTitle || '',
          senderAccountNumber: paymentData.senderAccountNumber || '',
          recipientAccount: paymentData.recipientAccount || '',
          receiptImageUrl: paymentData.receiptImageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
          status: 'Verification Pending',
          createdAt: new Date().toISOString(),
        };
        payments.unshift(newPayment);
        setLocal('payments', payments);

        // Update local booking
        const bookings = getLocal('bookings', initialBookings);
        const b = bookings.find((item) => item.id === newPayment.bookingId);
        if (b) {
          b.paymentStatus = 'Verification Pending';
          b.bookingStatus = 'Under Verification';
          b.paymentId = newPayment.id;
          setLocal('bookings', bookings);
        }

        this.addAuditLog('Submitted Payment', 'Payment', newPayment.id, newPayment.residentName, 'Student/Resident', `Submitted PKR ${newPayment.amount} via ${newPayment.method}`);
        return newPayment;
      }
    );
  },

  async verifyPayment(id: string, status: Payment['status'], adminRemarks: string, verifiedBy: string): Promise<Payment> {
    return fetchWithFallback(
      `/api/payments/${id}/verify`,
      {
        method: 'PUT',
        body: JSON.stringify({ status, adminRemarks, verifiedBy }),
      },
      () => {
        const payments = getLocal('payments', initialPayments);
        const p = payments.find((item) => item.id === id);
        if (!p) throw new Error('Payment not found');
        p.status = status;
        p.adminRemarks = adminRemarks;
        p.verifiedBy = verifiedBy;
        p.verifiedAt = new Date().toISOString();
        setLocal('payments', payments);

        // Update booking
        const bookings = getLocal('bookings', initialBookings);
        const b = bookings.find((item) => item.id === p.bookingId);
        if (b) {
          if (status === 'Payment Verified') {
            b.paymentStatus = 'Payment Verified';
            b.bookingStatus = 'Confirmed';
          } else if (status === 'Payment Failed') {
            b.paymentStatus = 'Payment Failed';
            b.bookingStatus = 'Payment Pending';
          }
          setLocal('bookings', bookings);
        }

        this.addAuditLog('Payment Verified', 'Payment', id, verifiedBy, 'Hostel Admin', `Marked payment ${status}`);
        return p;
      }
    );
  },

  // RESIDENT FEES & MONTHLY INVOICING
  async getFees(residentId?: string): Promise<FeeInvoice[]> {
    const url = residentId ? `/api/fees?residentId=${residentId}` : '/api/fees';
    return fetchWithFallback(url, undefined, () => {
      const fees = getLocal('feeInvoices', initialFeeInvoices);
      return residentId ? fees.filter((f) => f.residentId === residentId) : fees;
    });
  },

  async createFeeInvoice(invoiceData: Partial<FeeInvoice>): Promise<FeeInvoice> {
    return fetchWithFallback(
      '/api/fees',
      {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      },
      () => {
        const fees = getLocal('feeInvoices', initialFeeInvoices);
        const roomRent = Number(invoiceData.roomRent) || 0;
        const foodCharges = Number(invoiceData.foodCharges) || 0;
        const utilityCharges = Number(invoiceData.utilityCharges) || 0;
        const lateFee = Number(invoiceData.lateFee) || 0;
        const discount = Number(invoiceData.discount) || 0;
        const totalPayable = roomRent + foodCharges + utilityCharges + lateFee - discount;
        const amountPaid = Number(invoiceData.amountPaid) || 0;

        const newInv: FeeInvoice = {
          id: `INV-${Date.now().toString().slice(-6)}`,
          bookingId: invoiceData.bookingId,
          residentId: invoiceData.residentId || 'usr-std-1',
          residentName: invoiceData.residentName || 'Resident',
          phone: invoiceData.phone || '',
          roomNumber: invoiceData.roomNumber || '201',
          roomType: invoiceData.roomType || '2-seater',
          billingMonth: invoiceData.billingMonth || 'Current Month',
          dueDate: invoiceData.dueDate || new Date().toISOString().split('T')[0],
          roomRent,
          foodCharges,
          utilityCharges,
          lateFee,
          discount,
          totalPayable,
          amountPaid,
          remainingBalance: Math.max(0, totalPayable - amountPaid),
          status: invoiceData.status || (amountPaid >= totalPayable ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Pending'),
          notes: invoiceData.notes,
        };
        fees.unshift(newInv);
        setLocal('feeInvoices', fees);
        this.addAuditLog('Created Fee Invoice', 'Payment', newInv.id, 'Admin', 'Hostel Admin', `Created ${newInv.billingMonth} invoice for ${newInv.residentName}`);
        return newInv;
      }
    );
  },

  async updateFeeInvoice(id: string, updates: Partial<FeeInvoice>): Promise<FeeInvoice> {
    return fetchWithFallback(
      `/api/fees/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      },
      () => {
        const fees = getLocal('feeInvoices', initialFeeInvoices);
        const idx = fees.findIndex((f) => f.id === id);
        if (idx !== -1) {
          const updated = { ...fees[idx], ...updates };
          updated.totalPayable =
            (updated.roomRent || 0) +
            (updated.foodCharges || 0) +
            (updated.utilityCharges || 0) +
            (updated.lateFee || 0) -
            (updated.discount || 0);
          updated.remainingBalance = Math.max(0, updated.totalPayable - (updated.amountPaid || 0));
          if (updated.remainingBalance === 0 && updated.totalPayable > 0) {
            updated.status = 'Paid';
          }
          fees[idx] = updated;
          setLocal('feeInvoices', fees);
          this.addAuditLog('Updated Fee Invoice', 'Payment', id, 'Admin', 'Hostel Admin', `Updated fee record`);
          return updated;
        }
        throw new Error('Invoice not found');
      }
    );
  },

  async payFeeInvoice(id: string, amountPaid: number, paymentMethod: string, transactionReference?: string, notes?: string, recordedBy = 'Admin'): Promise<FeeInvoice> {
    return fetchWithFallback(
      `/api/fees/${id}/pay`,
      {
        method: 'POST',
        body: JSON.stringify({ amountPaid, paymentMethod, transactionReference, notes, recordedBy }),
      },
      () => {
        const fees = getLocal('feeInvoices', initialFeeInvoices);
        const inv = fees.find((f) => f.id === id);
        if (!inv) throw new Error('Invoice not found');

        const payAmt = Number(amountPaid) || inv.remainingBalance;
        inv.amountPaid = (inv.amountPaid || 0) + payAmt;
        inv.remainingBalance = Math.max(0, inv.totalPayable - inv.amountPaid);
        inv.status = inv.remainingBalance === 0 ? 'Paid' : 'Partially Paid';
        inv.paymentMethod = (paymentMethod as any) || 'Cash';
        inv.transactionReference = transactionReference || `REC-${Date.now().toString().slice(-4)}`;
        inv.receiptNumber = `RCP-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        inv.paidAt = new Date().toISOString();
        inv.recordedBy = recordedBy;
        if (notes) inv.notes = notes;

        setLocal('feeInvoices', fees);
        this.addAuditLog('Received Fee Payment', 'Payment', id, recordedBy, 'Hostel Admin', `Collected PKR ${payAmt.toLocaleString()} for ${inv.billingMonth}`);
        return inv;
      }
    );
  },

  async generateMonthlyBatchFees(billingMonth: string, dueDate: string, performedBy = 'Admin'): Promise<{ success: boolean; count: number; invoices: FeeInvoice[] }> {
    return fetchWithFallback(
      '/api/fees/generate-monthly-batch',
      {
        method: 'POST',
        body: JSON.stringify({ billingMonth, dueDate, performedBy }),
      },
      () => {
        const fees = getLocal('feeInvoices', initialFeeInvoices);
        const bookings = getLocal('bookings', initialBookings);
        const activeResidents = bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In');

        const created: FeeInvoice[] = [];
        for (const res of activeResidents) {
          const exists = fees.find((f) => f.residentName === res.residentName && f.billingMonth === billingMonth);
          if (!exists) {
            const inv: FeeInvoice = {
              id: `INV-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
              bookingId: res.id,
              residentId: res.userId,
              residentName: res.residentName,
              phone: res.phone,
              roomNumber: res.assignedRoomNumber || res.preferredRoomNumber || '201',
              roomType: res.roomTypeId,
              billingMonth,
              dueDate,
              roomRent: res.monthlyRent,
              foodCharges: res.foodCharges || 0,
              utilityCharges: 2000,
              lateFee: 0,
              discount: 0,
              totalPayable: res.monthlyRent + (res.foodCharges || 0) + 2000,
              amountPaid: 0,
              remainingBalance: res.monthlyRent + (res.foodCharges || 0) + 2000,
              status: 'Pending',
              notes: `Monthly fee challan for ${billingMonth}`,
            };
            fees.unshift(inv);
            created.push(inv);
          }
        }
        setLocal('feeInvoices', fees);
        this.addAuditLog('Batch Fee Generation', 'Payment', billingMonth, performedBy, 'Hostel Admin', `Generated ${created.length} invoices`);
        return { success: true, count: created.length, invoices: created };
      }
    );
  },

  // COMPLAINTS
  async getComplaints(userId?: string): Promise<Complaint[]> {
    const url = userId ? `/api/complaints?userId=${userId}` : '/api/complaints';
    return fetchWithFallback(url, undefined, () => {
      const complaints = getLocal('complaints', initialComplaints);
      return userId ? complaints.filter((c) => c.userId === userId) : complaints;
    });
  },

  async submitComplaint(complaintData: Partial<Complaint> & { userIndicatedEmergency?: boolean }): Promise<Complaint> {
    return fetchWithFallback(
      '/api/complaints',
      {
        method: 'POST',
        body: JSON.stringify(complaintData),
      },
      () => {
        const complaints = getLocal('complaints', initialComplaints);
        const cfg = getLocal('config', initialHostelConfig);
        const isEmergency = complaintData.userIndicatedEmergency || complaintData.severity === 'Emergency';
        const complaintId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

        let policeReferenceNumber: string | undefined;
        let policeStatus: Complaint['policeStatus'] = 'Not Escalated';
        let policeFeedbackNotes: string | undefined;

        if (complaintData.requestPoliceEscalation && (isEmergency || complaintData.severity === 'Serious')) {
          policeReferenceNumber = `ICT-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
          policeStatus = 'Submitted';
          policeFeedbackNotes = `Dispatched to ${cfg.policeConfig.policeStation}. Official reference #${policeReferenceNumber} issued.`;
        }

        const newComplaint: Complaint = {
          id: complaintId,
          userId: complaintData.userId || 'usr-std-1',
          studentName: complaintData.isConfidential ? 'Confidential Resident' : (complaintData.studentName || 'Resident'),
          studentPhone: complaintData.isConfidential ? 'Confidential (Warden Contact Only)' : (complaintData.studentPhone || ''),
          roomNumber: complaintData.roomNumber || 'N/A',
          category: complaintData.category || 'Other',
          severity: isEmergency ? 'Emergency' : (complaintData.severity || 'Normal'),
          description: complaintData.description || '',
          incidentDate: complaintData.incidentDate || new Date().toISOString().split('T')[0],
          incidentLocation: complaintData.incidentLocation || 'Hostel Premises',
          evidenceFiles: complaintData.evidenceFiles || [],
          isConfidential: !!complaintData.isConfidential,
          requestPoliceEscalation: !!complaintData.requestPoliceEscalation,
          status: policeReferenceNumber ? 'Escalated to Police' : (isEmergency ? 'Under Review' : 'Submitted'),
          policeJurisdiction: `${cfg.policeConfig.city}, ${cfg.policeConfig.district}`,
          policeStation: cfg.policeConfig.policeStation,
          policeReferenceNumber,
          policeSubmissionDate: policeReferenceNumber ? new Date().toISOString() : undefined,
          policeStatus,
          policeFeedbackNotes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        complaints.unshift(newComplaint);
        setLocal('complaints', complaints);

        this.addAuditLog(
          'Filed Complaint',
          'Complaint',
          newComplaint.id,
          newComplaint.studentName,
          'Student/Resident',
          `Filed [${newComplaint.severity}] complaint for ${newComplaint.category}`,
          !!policeReferenceNumber
        );

        return newComplaint;
      }
    );
  },

  async updateComplaint(id: string, updates: Partial<Complaint>, performedBy = 'Admin'): Promise<Complaint> {
    return fetchWithFallback(
      `/api/complaints/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ ...updates, performedBy }),
      },
      () => {
        const complaints = getLocal('complaints', initialComplaints);
        const idx = complaints.findIndex((c) => c.id === id);
        if (idx !== -1) {
          complaints[idx] = { ...complaints[idx], ...updates, updatedAt: new Date().toISOString() };
          setLocal('complaints', complaints);
          this.addAuditLog('Updated Complaint', 'Complaint', id, performedBy, 'Hostel Admin', `Updated status to ${updates.status || 'current'}`);
          return complaints[idx];
        }
        throw new Error('Complaint not found');
      }
    );
  },

  async escalateToPolice(id: string, performedBy: string, officerNotes?: string): Promise<{ success: boolean; referenceNumber: string; policeStation: string }> {
    return fetchWithFallback(
      `/api/complaints/${id}/escalate-police`,
      {
        method: 'POST',
        body: JSON.stringify({ performedBy, officerNotes }),
      },
      () => {
        const complaints = getLocal('complaints', initialComplaints);
        const cfg = getLocal('config', initialHostelConfig);
        const c = complaints.find((item) => item.id === id);
        if (!c) throw new Error('Complaint not found');

        const ref = `ICT-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        c.policeReferenceNumber = ref;
        c.policeJurisdiction = `${cfg.policeConfig.city}, ${cfg.policeConfig.district}`;
        c.policeStation = cfg.policeConfig.policeStation;
        c.policeSubmissionDate = new Date().toISOString();
        c.policeStatus = 'Submitted';
        c.status = 'Escalated to Police';
        c.policeFeedbackNotes = officerNotes || `Officially transmitted to ${cfg.policeConfig.policeStation}. Reference #${ref} allocated.`;
        c.updatedAt = new Date().toISOString();

        setLocal('complaints', complaints);
        this.addAuditLog(
          'Official Police Escalation Transmitted',
          'Complaint',
          id,
          performedBy,
          'Hostel Admin',
          `Transmitted to ${cfg.policeConfig.policeStation}. Reference allocated: ${ref}`,
          true
        );

        return {
          success: true,
          referenceNumber: ref,
          policeStation: cfg.policeConfig.policeStation,
        };
      }
    );
  },

  // FACILITIES, FOOD, POLICIES, TIMINGS, GALLERY
  async getFacilities(): Promise<Facility[]> {
    return fetchWithFallback('/api/facilities', undefined, () => getLocal('facilities', initialFacilities));
  },

  async updateFacility(id: string, updates: Partial<Facility>): Promise<Facility> {
    return fetchWithFallback(
      `/api/facilities/${id}`,
      { method: 'PUT', body: JSON.stringify(updates) },
      () => {
        const list = getLocal('facilities', initialFacilities);
        const idx = list.findIndex((f) => f.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updates };
          setLocal('facilities', list);
          return list[idx];
        }
        throw new Error('Facility not found');
      }
    );
  },

  async getFood(): Promise<FoodConfig> {
    return fetchWithFallback('/api/food', undefined, () => getLocal('food', initialFoodConfig));
  },

  async updateFood(updates: Partial<FoodConfig>): Promise<FoodConfig> {
    return fetchWithFallback(
      '/api/food',
      { method: 'PUT', body: JSON.stringify(updates) },
      () => {
        const cur = getLocal('food', initialFoodConfig);
        const updated = { ...cur, ...updates };
        setLocal('food', updated);
        return updated;
      }
    );
  },

  async getPolicies(): Promise<HostelPolicyItem[]> {
    return fetchWithFallback('/api/policies', undefined, () => getLocal('policies', initialPolicies));
  },

  async updatePolicies(policies: HostelPolicyItem[]): Promise<HostelPolicyItem[]> {
    return fetchWithFallback(
      '/api/policies',
      { method: 'PUT', body: JSON.stringify(policies) },
      () => {
        setLocal('policies', policies);
        return policies;
      }
    );
  },

  async getTimings(): Promise<HostelTimings> {
    return fetchWithFallback('/api/timings', undefined, () => getLocal('timings', initialTimings));
  },

  async updateTimings(timings: Partial<HostelTimings>): Promise<HostelTimings> {
    return fetchWithFallback(
      '/api/timings',
      { method: 'PUT', body: JSON.stringify(timings) },
      () => {
        const cur = getLocal('timings', initialTimings);
        const updated = { ...cur, ...timings };
        setLocal('timings', updated);
        return updated;
      }
    );
  },

  async getGallery(): Promise<GalleryItem[]> {
    return fetchWithFallback('/api/gallery', undefined, () => getLocal('gallery', initialGallery));
  },

  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    return fetchWithFallback(
      '/api/gallery',
      { method: 'POST', body: JSON.stringify(item) },
      () => {
        const gallery = getLocal('gallery', initialGallery);
        const newItem: GalleryItem = { ...item, id: `gal-${Date.now().toString().slice(-4)}` };
        gallery.push(newItem);
        setLocal('gallery', gallery);
        return newItem;
      }
    );
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    return fetchWithFallback(
      `/api/gallery/${id}`,
      { method: 'DELETE' },
      () => {
        const gallery = getLocal('gallery', initialGallery);
        const filtered = gallery.filter((g) => g.id !== id);
        setLocal('gallery', filtered);
        return { success: true };
      }
    );
  },

  // AUDIT LOGS
  async getAuditLogs(): Promise<AuditLog[]> {
    return fetchWithFallback('/api/audit-logs', undefined, () => getLocal('auditLogs', initialAuditLogs));
  },

  addAuditLog(action: string, entityType: AuditLog['entityType'], entityId: string, performedBy: string, userRole: string, details: string, isPoliceAction = false): AuditLog {
    const logs = getLocal('auditLogs', initialAuditLogs);
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      action,
      entityType,
      entityId,
      performedBy,
      userRole,
      details,
      timestamp: new Date().toISOString(),
      isPoliceAction,
    };
    logs.unshift(newLog);
    setLocal('auditLogs', logs);
    return newLog;
  },

  // CONTACT MESSAGE
  async sendContactMessage(name: string, phone: string, email: string, subject: string, message: string): Promise<ContactMessage> {
    return fetchWithFallback(
      '/api/contact',
      {
        method: 'POST',
        body: JSON.stringify({ name, phone, email, subject, message }),
      },
      () => {
        const msgs = getLocal('contactMessages', [] as ContactMessage[]);
        const newMsg: ContactMessage = {
          id: `msg-${Date.now().toString().slice(-4)}`,
          name,
          phone,
          email,
          subject,
          message,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        msgs.unshift(newMsg);
        setLocal('contactMessages', msgs);
        return newMsg;
      }
    );
  },

  // AUTH
  async login(email: string): Promise<{ user: User; token: string }> {
    return fetchWithFallback(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      () => {
        const users = getLocal('users', initialUsers);
        const u = users.find((item) => item.email.toLowerCase() === email.toLowerCase().trim());
        if (!u) {
          throw new Error('User not found. Use admin@pakhostel.pk or resident@pakhostel.pk');
        }
        return { user: u, token: `local-token-${u.id}` };
      }
    );
  },

  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    return fetchWithFallback(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      () => {
        const users = getLocal('users', initialUsers);
        const newUser: User = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: userData.name || 'Resident',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'Student/Resident',
          cnic: userData.cnic,
          guardianName: userData.guardianName,
          guardianPhone: userData.guardianPhone,
          institute: userData.institute,
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        setLocal('users', users);
        return { user: newUser, token: `local-token-${newUser.id}` };
      }
    );
  },
};
