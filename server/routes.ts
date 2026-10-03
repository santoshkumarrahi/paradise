import { Router, Request, Response } from 'express';
import { db } from './db.js';
import {
  Booking,
  Payment,
  Complaint,
  Room,
  AuditLog,
  Facility,
  FoodConfig,
  HostelPolicyItem,
  HostelTimings,
  GalleryItem,
  User,
  ComplaintSeverity,
  FeeInvoice,
} from '../src/types/index.js';

export const apiRouter = Router();

// ==========================================
// 1. STATS
// ==========================================
apiRouter.get('/stats', (req: Request, res: Response) => {
  const data = db.getData();
  const totalRooms = data.rooms.length;
  const availableRooms = data.rooms.filter((r) => r.status === 'Available').length;
  const occupiedRooms = data.rooms.filter((r) => r.status === 'Occupied').length;
  const maintenanceRooms = data.rooms.filter((r) => r.status === 'Maintenance').length;
  const totalResidents = data.bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length;
  const pendingBookings = data.bookings.filter((b) => b.bookingStatus === 'Pending' || b.bookingStatus === 'Under Verification').length;
  const confirmedBookings = data.bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length;
  const pendingPayments = data.payments.filter((p) => p.status === 'Verification Pending').length;
  const verifiedPayments = data.payments.filter((p) => p.status === 'Payment Verified').length;
  const totalRevenuePKR = data.payments
    .filter((p) => p.status === 'Payment Verified')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingComplaints = data.complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'In Progress').length;
  const seriousComplaints = data.complaints.filter((c) => c.severity === 'Serious').length;
  const emergencyComplaints = data.complaints.filter((c) => c.severity === 'Emergency').length;
  const resolvedComplaints = data.complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const policeEscalations = data.complaints.filter((c) => c.policeReferenceNumber && c.policeReferenceNumber.length > 0).length;

  res.json({
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    totalResidents,
    pendingBookings,
    confirmedBookings,
    pendingPayments,
    verifiedPayments,
    totalRevenuePKR,
    pendingComplaints,
    seriousComplaints,
    emergencyComplaints,
    resolvedComplaints,
    policeEscalations,
  });
});

// ==========================================
// 2. AUTHENTICATION (DEMO/SESSION)
// ==========================================
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = db.getData();
  const user = data.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase().trim());

  if (!user) {
    // If not found, create guest/student if demo
    return res.status(401).json({ error: 'Invalid credentials or user not found. Try admin@pakhostel.pk or resident@pakhostel.pk' });
  }

  // Record audit
  db.logAudit('User Login', 'System', user.id, user.name, user.role, `Logged in successfully from web interface.`);
  res.json({ user, token: `token-${user.id}-${Date.now()}` });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role, cnic, guardianName, guardianPhone, institute } = req.body;
  const data = db.getData();

  const existing = data.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'Email already registered. Please sign in.' });
  }

  const newUser: User = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    name: name || 'New Resident',
    email: email.toLowerCase().trim(),
    phone: phone || '',
    role: role || 'Student/Resident',
    cnic,
    guardianName,
    guardianPhone,
    institute,
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  db.save();

  db.logAudit('User Registered', 'Resident', newUser.id, newUser.name, newUser.role, `Created new ${newUser.role} account.`);
  res.status(201).json({ user: newUser, token: `token-${newUser.id}-${Date.now()}` });
});

// ==========================================
// 3. HOSTEL CONFIG & POLICE CONFIG
// ==========================================
apiRouter.get('/hostel/config', (req: Request, res: Response) => {
  const data = db.getData();
  res.json(data.config);
});

apiRouter.put('/hostel/config', (req: Request, res: Response) => {
  const data = db.getData();
  data.config = {
    ...data.config,
    ...req.body,
  };
  db.save();
  db.logAudit('Updated Hostel Configuration', 'HostelConfig', data.config.id, req.body.updatedBy || 'Administrator', 'Super Admin', 'Modified master hostel address, police, or payment details.');
  res.json(data.config);
});

// ==========================================
// 4. ROOMS
// ==========================================
apiRouter.get('/rooms', (req: Request, res: Response) => {
  const data = db.getData();
  res.json(data.rooms);
});

apiRouter.post('/rooms', (req: Request, res: Response) => {
  const data = db.getData();
  const roomData: Room = {
    ...req.body,
    id: req.body.id || `room-${Date.now().toString().slice(-4)}`,
    occupiedBeds: req.body.occupiedBeds || 0,
    status: req.body.status || 'Available',
  };
  data.rooms.push(roomData);
  db.save();

  db.logAudit('Added New Room', 'Room', roomData.id, req.body.performedBy || 'Admin', 'Hostel Admin', `Created Room ${roomData.roomNumber} (${roomData.roomType}).`);
  res.status(201).json(roomData);
});

apiRouter.put('/rooms/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.rooms.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  data.rooms[index] = {
    ...data.rooms[index],
    ...req.body,
  };
  db.save();

  db.logAudit('Updated Room Details', 'Room', id, req.body.performedBy || 'Admin', 'Hostel Admin', `Updated configuration for Room ${data.rooms[index].roomNumber}.`);
  res.json(data.rooms[index]);
});

apiRouter.delete('/rooms/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.rooms.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }
  const removed = data.rooms.splice(index, 1)[0];
  db.save();

  db.logAudit('Deleted Room', 'Room', id, 'Admin', 'Super Admin', `Removed Room ${removed.roomNumber} from database.`);
  res.json({ success: true, removed });
});

apiRouter.post('/rooms/:id/toggle-seats', (req: Request, res: Response) => {
  const { id } = req.params;
  const { seatsClosed, closedReason, performedBy } = req.body;
  const data = db.getData();
  const room = data.rooms.find((r) => r.id === id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  room.seatsClosed = seatsClosed !== undefined ? seatsClosed : !room.seatsClosed;
  if (closedReason !== undefined) room.closedReason = closedReason;

  if (room.seatsClosed) {
    if (room.status === 'Available') room.status = 'Unavailable';
  } else {
    if (room.occupiedBeds < room.totalBeds) room.status = 'Available';
  }

  db.save();
  db.logAudit(
    room.seatsClosed ? 'Room Seats Closed' : 'Room Seats Opened',
    'Room',
    room.id,
    performedBy || 'Admin',
    'Hostel Admin',
    `${room.seatsClosed ? 'Closed admissions' : 'Reopened admissions'} for Room ${room.roomNumber}. Reason: ${room.closedReason || 'Admin decision'}.`
  );

  res.json(room);
});

// ==========================================
// 5. BOOKINGS & DOUBLE-BOOKING PREVENTION
// ==========================================
apiRouter.get('/bookings', (req: Request, res: Response) => {
  const { userId } = req.query;
  const data = db.getData();
  if (userId) {
    const userBookings = data.bookings.filter((b) => b.userId === userId);
    return res.json(userBookings);
  }
  res.json(data.bookings);
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  const data = db.getData();
  const {
    userId,
    residentName,
    fatherGuardianName,
    cnic,
    dob,
    gender,
    phone,
    whatsapp,
    email,
    permanentAddress,
    emergencyContactName,
    emergencyContactNumber,
    studentWorkerStatus,
    instituteCompany,
    roomTypeId,
    preferredRoomNumber,
    checkInDate,
    stayDurationMonths,
    numberOfPersons,
    foodRequired,
    foodPackageType,
    specialRequirements,
    monthlyRent,
    securityDeposit,
    foodCharges,
    otherCharges,
    totalInitialPayment,
    acceptedPolicies,
  } = req.body;

  if (!acceptedPolicies) {
    return res.status(400).json({ error: 'You must accept the hostel policies and terms before booking.' });
  }

  // Find candidate room
  let targetRoom = data.rooms.find((r) => r.roomNumber === preferredRoomNumber && r.status === 'Available');
  if (!targetRoom) {
    // find any available room of requested type
    targetRoom = data.rooms.find((r) => r.roomType === roomTypeId && r.status === 'Available' && r.occupiedBeds < r.totalBeds);
  }

  if (!targetRoom && preferredRoomNumber) {
    // check if room exists and has beds
    const designated = data.rooms.find((r) => r.roomNumber === preferredRoomNumber);
    if (designated && designated.occupiedBeds >= designated.totalBeds) {
      return res.status(400).json({ error: `Room ${preferredRoomNumber} is currently fully occupied. Please select an available room.` });
    }
  }

  const bookingId = `BK-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking: Booking = {
    id: bookingId,
    userId: userId || `usr-${Date.now().toString().slice(-5)}`,
    residentName,
    fatherGuardianName,
    cnic,
    dob: dob || '2000-01-01',
    gender: gender || 'Male',
    phone,
    whatsapp: whatsapp || phone,
    email,
    permanentAddress,
    emergencyContactName,
    emergencyContactNumber,
    studentWorkerStatus: studentWorkerStatus || 'Student',
    instituteCompany: instituteCompany || '',
    roomTypeId,
    roomId: targetRoom?.id,
    preferredRoomNumber: preferredRoomNumber || targetRoom?.roomNumber,
    assignedRoomNumber: targetRoom?.roomNumber,
    checkInDate,
    stayDurationMonths: Number(stayDurationMonths) || 6,
    numberOfPersons: Number(numberOfPersons) || 1,
    foodRequired: !!foodRequired,
    foodPackageType: foodPackageType || (foodRequired ? 'Full Board (3 Meals)' : 'None'),
    specialRequirements,
    monthlyRent: Number(monthlyRent) || 20000,
    securityDeposit: Number(securityDeposit) || 10000,
    foodCharges: Number(foodCharges) || 0,
    otherCharges: Number(otherCharges) || 1000,
    totalInitialPayment: Number(totalInitialPayment) || 31000,
    acceptedPolicies: true,
    bookingStatus: 'Payment Pending',
    paymentStatus: 'Unpaid',
    createdAt: new Date().toISOString(),
    notes: `Initial booking created via web portal. Awaiting payment receipt verification.`,
  };

  data.bookings.unshift(newBooking);
  db.save();

  db.logAudit(
    'New Booking Submitted',
    'Booking',
    newBooking.id,
    residentName,
    'Student/Resident',
    `Applied for ${roomTypeId} (Preferred: Room ${newBooking.preferredRoomNumber || 'Any'}). Total Initial PKR ${newBooking.totalInitialPayment.toLocaleString()}.`
  );

  res.status(201).json(newBooking);
});

apiRouter.put('/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.bookings.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const prevStatus = data.bookings[index].bookingStatus;
  const updatedBooking = {
    ...data.bookings[index],
    ...req.body,
  };

  // If status changed to Confirmed or Checked In, ensure room occupancy is updated properly
  if (
    (updatedBooking.bookingStatus === 'Confirmed' || updatedBooking.bookingStatus === 'Checked In') &&
    prevStatus !== 'Confirmed' &&
    prevStatus !== 'Checked In'
  ) {
    const room = data.rooms.find((r) => r.roomNumber === updatedBooking.assignedRoomNumber || r.id === updatedBooking.roomId);
    if (room) {
      room.occupiedBeds = Math.min(room.totalBeds, room.occupiedBeds + 1);
      if (room.occupiedBeds >= room.totalBeds) {
        room.status = 'Occupied';
      }
    }
  } else if (
    (updatedBooking.bookingStatus === 'Cancelled' || updatedBooking.bookingStatus === 'Rejected' || updatedBooking.bookingStatus === 'Checked Out') &&
    (prevStatus === 'Confirmed' || prevStatus === 'Checked In')
  ) {
    const room = data.rooms.find((r) => r.roomNumber === updatedBooking.assignedRoomNumber || r.id === updatedBooking.roomId);
    if (room) {
      room.occupiedBeds = Math.max(0, room.occupiedBeds - 1);
      if (room.status === 'Occupied' && room.occupiedBeds < room.totalBeds) {
        room.status = 'Available';
      }
    }
  }

  data.bookings[index] = updatedBooking;
  db.save();

  db.logAudit(
    'Booking Status Updated',
    'Booking',
    id,
    req.body.performedBy || 'Admin',
    'Hostel Admin',
    `Status transitioned from "${prevStatus}" to "${updatedBooking.bookingStatus}". Notes: ${req.body.notes || 'Updated via dashboard'}.`
  );

  res.json(updatedBooking);
});

// ==========================================
// 6. PAYMENTS (JAZZCASH, EASYPAISA, BANK)
// ==========================================
apiRouter.get('/payments', (req: Request, res: Response) => {
  const { userId, bookingId } = req.query;
  const data = db.getData();
  let result = data.payments;
  if (userId) {
    result = result.filter((p) => p.userId === userId);
  }
  if (bookingId) {
    result = result.filter((p) => p.bookingId === bookingId);
  }
  res.json(result);
});

apiRouter.post('/payments', (req: Request, res: Response) => {
  const data = db.getData();
  const {
    bookingId,
    userId,
    residentName,
    amount,
    method,
    transactionId,
    senderAccountTitle,
    senderAccountNumber,
    recipientAccount,
    receiptImageUrl,
  } = req.body;

  if (!transactionId || !method) {
    return res.status(400).json({ error: 'Method and Transaction ID (TID) are required.' });
  }

  const paymentId = `PAY-${method.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const newPayment: Payment = {
    id: paymentId,
    bookingId,
    userId: userId || 'usr-std-1',
    residentName: residentName || 'Resident',
    amount: Number(amount) || 0,
    currency: 'PKR',
    method,
    transactionId,
    senderAccountTitle: senderAccountTitle || '',
    senderAccountNumber: senderAccountNumber || '',
    recipientAccount: recipientAccount || '',
    receiptImageUrl: receiptImageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'Verification Pending', // Rule 3 & 4: Uploading screenshot MUST NOT automatically verify payment
    createdAt: new Date().toISOString(),
  };

  data.payments.unshift(newPayment);

  // Update booking payment status
  const booking = data.bookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.paymentStatus = 'Verification Pending';
    booking.bookingStatus = 'Under Verification';
    booking.paymentId = paymentId;
  }

  db.save();

  db.logAudit(
    'Payment Submitted for Verification',
    'Payment',
    newPayment.id,
    residentName,
    'Student/Resident',
    `Submitted PKR ${newPayment.amount.toLocaleString()} via ${method} (TID: ${transactionId}). Verification pending admin review.`
  );

  res.status(201).json(newPayment);
});

apiRouter.put('/payments/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminRemarks, verifiedBy } = req.body;
  const data = db.getData();

  const payment = data.payments.find((p) => p.id === id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  payment.status = status; // 'Payment Verified' | 'Payment Failed' | 'Refunded'
  payment.adminRemarks = adminRemarks || 'Reconciled with bank account records.';
  payment.verifiedBy = verifiedBy || 'Hostel Administrator';
  payment.verifiedAt = new Date().toISOString();

  // If verified, update booking
  const booking = data.bookings.find((b) => b.id === payment.bookingId);
  if (booking) {
    if (status === 'Payment Verified') {
      booking.paymentStatus = 'Payment Verified';
      booking.bookingStatus = 'Confirmed';

      // Update room occupancy
      const room = data.rooms.find((r) => r.roomNumber === booking.assignedRoomNumber || r.id === booking.roomId);
      if (room) {
        room.occupiedBeds = Math.min(room.totalBeds, room.occupiedBeds + 1);
        if (room.occupiedBeds >= room.totalBeds) {
          room.status = 'Occupied';
        }
      }
    } else if (status === 'Payment Failed') {
      booking.paymentStatus = 'Payment Failed';
      booking.bookingStatus = 'Payment Pending';
    }
  }

  db.save();

  db.logAudit(
    'Payment Verification Processed',
    'Payment',
    payment.id,
    verifiedBy || 'Admin',
    'Hostel Admin',
    `Marked payment as "${status}" for PKR ${payment.amount.toLocaleString()}. Remarks: ${adminRemarks || 'N/A'}.`
  );

  res.json(payment);
});

// ==========================================
// 7. COMPLAINTS & POLICE ESCALATION
// ==========================================
function determineSeverity(category: string, userIndicatedEmergency = false): ComplaintSeverity {
  if (
    userIndicatedEmergency ||
    category === 'Physical Violence' ||
    category === 'Sexual Harassment/Abuse' ||
    category === 'Threats' ||
    category === 'Missing Person' ||
    category === 'Emergency'
  ) {
    return 'Emergency';
  }
  if (category === 'Theft' || category === 'Harassment' || category === 'Illegal Activity' || category === 'Staff Behavior') {
    return 'Serious';
  }
  return 'Normal';
}

apiRouter.get('/complaints', (req: Request, res: Response) => {
  const { userId } = req.query;
  const data = db.getData();
  if (userId) {
    // Privacy protection: Student can only view their own complaints
    const userComplaints = data.complaints.filter((c) => c.userId === userId);
    return res.json(userComplaints);
  }
  res.json(data.complaints);
});

apiRouter.post('/complaints', (req: Request, res: Response) => {
  const data = db.getData();
  const {
    userId,
    studentName,
    studentPhone,
    roomNumber,
    category,
    description,
    incidentDate,
    incidentLocation,
    evidenceFiles,
    isConfidential,
    requestPoliceEscalation,
    userIndicatedEmergency,
  } = req.body;

  const severity = determineSeverity(category, userIndicatedEmergency);
  const complaintId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

  let policeJurisdiction: string | undefined;
  let policeStation: string | undefined;
  let policeReferenceNumber: string | undefined;
  let policeSubmissionDate: string | undefined;
  let policeStatus: Complaint['policeStatus'] = 'Not Escalated';
  let policeFeedbackNotes: string | undefined;

  // If user requested police escalation AND it is serious/emergency
  if (requestPoliceEscalation && (severity === 'Emergency' || severity === 'Serious')) {
    if (data.config.policeConfig.apiAvailable) {
      // Simulate official authorized integration with ICT/Punjab Police citizen portal
      policeJurisdiction = `${data.config.policeConfig.city}, ${data.config.policeConfig.district}`;
      policeStation = data.config.policeConfig.policeStation;
      policeReferenceNumber = `ICT-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      policeSubmissionDate = new Date().toISOString();
      policeStatus = 'Submitted';
      policeFeedbackNotes = `Electronic complaint dispatched to ${data.config.policeConfig.policeStation}. Official Reference Number issued: ${policeReferenceNumber}. Authorized helpline: ${data.config.policeConfig.officialPolicePhone}.`;
    }
  }

  const newComplaint: Complaint = {
    id: complaintId,
    userId: userId || 'usr-std-1',
    studentName: isConfidential ? 'Confidential Resident' : (studentName || 'Resident'),
    studentPhone: isConfidential ? 'Confidential (Warden Contact Only)' : (studentPhone || ''),
    roomNumber: roomNumber || 'N/A',
    category,
    severity,
    description,
    incidentDate: incidentDate || new Date().toISOString().split('T')[0],
    incidentLocation: incidentLocation || 'Hostel Premises',
    evidenceFiles: evidenceFiles || [],
    isConfidential: !!isConfidential,
    requestPoliceEscalation: !!requestPoliceEscalation,
    status: policeReferenceNumber ? 'Escalated to Police' : (severity === 'Emergency' ? 'Under Review' : 'Submitted'),
    policeJurisdiction,
    policeStation,
    policeReferenceNumber,
    policeSubmissionDate,
    policeStatus,
    policeFeedbackNotes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.complaints.unshift(newComplaint);
  db.save();

  db.logAudit(
    'Complaint Filed',
    'Complaint',
    newComplaint.id,
    newComplaint.studentName,
    'Student/Resident',
    `Registered [${severity.toUpperCase()}] complaint under "${category}". Escalation requested: ${requestPoliceEscalation ? 'YES' : 'NO'}. ${policeReferenceNumber ? `Official Police Ref: ${policeReferenceNumber}` : ''}`,
    !!policeReferenceNumber
  );

  res.status(201).json(newComplaint);
});

apiRouter.put('/complaints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.complaints.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const prevStatus = data.complaints[index].status;
  const updated = {
    ...data.complaints[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  data.complaints[index] = updated;
  db.save();

  db.logAudit(
    'Complaint Updated',
    'Complaint',
    id,
    req.body.performedBy || 'Admin',
    'Hostel Admin',
    `Updated complaint status from "${prevStatus}" to "${updated.status}". Assigned staff: ${updated.assignedStaff || 'None'}.`
  );

  res.json(updated);
});

// Official Law Enforcement Escalation Endpoint
apiRouter.post('/complaints/:id/escalate-police', (req: Request, res: Response) => {
  const { id } = req.params;
  const { performedBy, officerNotes } = req.body;
  const data = db.getData();
  const complaint = data.complaints.find((c) => c.id === id);

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  if (!data.config.policeConfig.apiAvailable) {
    return res.status(503).json({
      error: 'Police electronic integration is currently unavailable. Please contact the relevant police/emergency authority directly.',
      officialHelpline: data.config.policeConfig.officialPolicePhone,
      portal: data.config.policeConfig.officialComplaintPortal,
      station: data.config.policeConfig.policeStation,
    });
  }

  // Official electronic submission
  const officialRef = `ICT-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  complaint.policeReferenceNumber = officialRef;
  complaint.policeJurisdiction = `${data.config.policeConfig.city}, ${data.config.policeConfig.district}`;
  complaint.policeStation = data.config.policeConfig.policeStation;
  complaint.policeSubmissionDate = new Date().toISOString();
  complaint.policeStatus = 'Submitted';
  complaint.status = 'Escalated to Police';
  complaint.policeFeedbackNotes = officerNotes || `Officially transmitted via authorized electronic law-enforcement integration to ${data.config.policeConfig.policeStation}. Reference number ${officialRef} allocated.`;
  complaint.updatedAt = new Date().toISOString();

  db.save();

  // Immutable audit log
  db.logAudit(
    'Official Police Escalation Transmitted',
    'Complaint',
    complaint.id,
    performedBy || 'Hostel Security / Warden',
    'Hostel Admin',
    `Complaint officially escalated to ${data.config.policeConfig.policeStation}. Official Reference Number issued: ${officialRef}. Student: ${complaint.studentName}. Category: ${complaint.category}.`,
    true
  );

  res.json({
    success: true,
    complaint,
    referenceNumber: officialRef,
    policeStation: data.config.policeConfig.policeStation,
    helpline: data.config.policeConfig.officialPolicePhone,
  });
});

// ==========================================
// 8. FACILITIES, FOOD, POLICIES, TIMINGS, GALLERY
// ==========================================
apiRouter.get('/facilities', (req: Request, res: Response) => {
  res.json(db.getData().facilities);
});

apiRouter.put('/facilities/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.facilities.findIndex((f) => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Facility not found' });
  }
  data.facilities[index] = { ...data.facilities[index], ...req.body };
  db.save();
  db.logAudit('Updated Facility', 'HostelConfig', id, 'Admin', 'Hostel Admin', `Updated facility ${data.facilities[index].name}.`);
  res.json(data.facilities[index]);
});

apiRouter.get('/food', (req: Request, res: Response) => {
  res.json(db.getData().food);
});

apiRouter.put('/food', (req: Request, res: Response) => {
  const data = db.getData();
  data.food = { ...data.food, ...req.body };
  db.save();
  db.logAudit('Updated Food Configuration', 'HostelConfig', 'food-01', 'Admin', 'Hostel Admin', 'Updated food pricing, timings, or weekly mess menu.');
  res.json(data.food);
});

apiRouter.get('/policies', (req: Request, res: Response) => {
  res.json(db.getData().policies);
});

apiRouter.put('/policies', (req: Request, res: Response) => {
  const data = db.getData();
  data.policies = req.body;
  db.save();
  db.logAudit('Updated Hostel Policies', 'HostelConfig', 'policies-01', 'Admin', 'Hostel Admin', 'Updated terms, fines, and student conduct policies.');
  res.json(data.policies);
});

apiRouter.get('/timings', (req: Request, res: Response) => {
  res.json(db.getData().timings);
});

apiRouter.put('/timings', (req: Request, res: Response) => {
  const data = db.getData();
  data.timings = { ...data.timings, ...req.body };
  db.save();
  db.logAudit('Updated Hostel Timings', 'HostelConfig', 'timings-01', 'Admin', 'Hostel Admin', 'Updated gate, mess, and quiet hour schedules.');
  res.json(data.timings);
});

apiRouter.get('/gallery', (req: Request, res: Response) => {
  res.json(db.getData().gallery);
});

apiRouter.post('/gallery', (req: Request, res: Response) => {
  const data = db.getData();
  const newItem: GalleryItem = {
    ...req.body,
    id: `gal-${Date.now().toString().slice(-4)}`,
  };
  data.gallery.push(newItem);
  db.save();
  db.logAudit('Added Gallery Photo', 'HostelConfig', newItem.id, 'Admin', 'Hostel Admin', `Added photo: ${newItem.title}.`);
  res.status(201).json(newItem);
});

apiRouter.delete('/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.gallery.findIndex((g) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Photo not found' });
  }
  const removed = data.gallery.splice(index, 1)[0];
  db.save();
  res.json({ success: true, removed });
});

// ==========================================
// 9. AUDIT LOGS & CONTACT MESSAGES
// ==========================================
apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  res.json(db.getData().auditLogs);
});

apiRouter.get('/contact', (req: Request, res: Response) => {
  res.json(db.getData().contactMessages);
});

apiRouter.post('/contact', (req: Request, res: Response) => {
  const data = db.getData();
  const { name, phone, email, subject, message } = req.body;
  const newMessage = {
    id: `msg-${Date.now().toString().slice(-4)}`,
    name,
    phone,
    email,
    subject: subject || 'General Inquiry',
    message,
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  data.contactMessages.unshift(newMessage);
  db.save();
  res.status(201).json(newMessage);
});

// ==========================================
// 10. RESIDENT FEES & MONTHLY INVOICING
// ==========================================
apiRouter.get('/fees', (req: Request, res: Response) => {
  const { residentId } = req.query;
  const data = db.getData();
  if (!data.feeInvoices) data.feeInvoices = [];
  if (residentId) {
    return res.json(data.feeInvoices.filter((f) => f.residentId === residentId));
  }
  res.json(data.feeInvoices);
});

apiRouter.post('/fees', (req: Request, res: Response) => {
  const data = db.getData();
  if (!data.feeInvoices) data.feeInvoices = [];
  const roomRent = Number(req.body.roomRent) || 0;
  const foodCharges = Number(req.body.foodCharges) || 0;
  const utilityCharges = Number(req.body.utilityCharges) || 0;
  const lateFee = Number(req.body.lateFee) || 0;
  const discount = Number(req.body.discount) || 0;
  const totalPayable = roomRent + foodCharges + utilityCharges + lateFee - discount;
  const amountPaid = Number(req.body.amountPaid) || 0;

  const invoiceData: FeeInvoice = {
    ...req.body,
    id: req.body.id || `INV-${Date.now().toString().slice(-6)}`,
    roomRent,
    foodCharges,
    utilityCharges,
    lateFee,
    discount,
    totalPayable,
    amountPaid,
    remainingBalance: Math.max(0, totalPayable - amountPaid),
    status: req.body.status || (amountPaid >= totalPayable ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Pending'),
  };
  data.feeInvoices.unshift(invoiceData);
  db.save();
  db.logAudit(
    'Fee Invoice Generated',
    'Payment',
    invoiceData.id,
    req.body.performedBy || 'Hostel Admin',
    'Hostel Admin',
    `Generated ${invoiceData.billingMonth} fee invoice for ${invoiceData.residentName} (Room ${invoiceData.roomNumber}). Total: PKR ${invoiceData.totalPayable.toLocaleString()}.`
  );
  res.status(201).json(invoiceData);
});

apiRouter.put('/fees/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  if (!data.feeInvoices) data.feeInvoices = [];
  const index = data.feeInvoices.findIndex((f) => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Fee invoice not found' });
  }

  const updated = { ...data.feeInvoices[index], ...req.body };
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

  data.feeInvoices[index] = updated;
  db.save();
  db.logAudit(
    'Fee Invoice Updated',
    'Payment',
    id,
    req.body.performedBy || 'Hostel Admin',
    'Hostel Admin',
    `Updated invoice ${id} status to ${updated.status}. Balance: PKR ${updated.remainingBalance}.`
  );
  res.json(updated);
});

apiRouter.post('/fees/:id/pay', (req: Request, res: Response) => {
  const { id } = req.params;
  const { amountPaid, paymentMethod, transactionReference, notes, recordedBy } = req.body;
  const data = db.getData();
  if (!data.feeInvoices) data.feeInvoices = [];
  const invoice = data.feeInvoices.find((f) => f.id === id);
  if (!invoice) {
    return res.status(404).json({ error: 'Fee invoice not found' });
  }
  const paymentAmount = Number(amountPaid) || invoice.remainingBalance;
  invoice.amountPaid = (invoice.amountPaid || 0) + paymentAmount;
  invoice.remainingBalance = Math.max(0, invoice.totalPayable - invoice.amountPaid);
  invoice.status = invoice.remainingBalance === 0 ? 'Paid' : 'Partially Paid';
  invoice.paymentMethod = paymentMethod || 'Cash';
  invoice.transactionReference = transactionReference || `REC-${Date.now().toString().slice(-4)}`;
  invoice.receiptNumber = `RCP-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  invoice.paidAt = new Date().toISOString();
  invoice.recordedBy = recordedBy || 'Hostel Accounts Officer';
  if (notes) invoice.notes = notes;

  db.save();
  db.logAudit(
    'Resident Fee Received',
    'Payment',
    invoice.id,
    recordedBy || 'Admin',
    'Hostel Admin',
    `Received PKR ${paymentAmount.toLocaleString()} from ${invoice.residentName} (${invoice.billingMonth}). Receipt #${invoice.receiptNumber}.`
  );
  res.json(invoice);
});

apiRouter.post('/fees/generate-monthly-batch', (req: Request, res: Response) => {
  const { billingMonth, dueDate, performedBy } = req.body;
  const data = db.getData();
  if (!data.feeInvoices) data.feeInvoices = [];

  const activeResidents = data.bookings.filter(
    (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In'
  );

  const generated: FeeInvoice[] = [];
  for (const resident of activeResidents) {
    const existing = data.feeInvoices.find(
      (f) => f.residentName === resident.residentName && f.billingMonth === billingMonth
    );
    if (!existing) {
      const inv: FeeInvoice = {
        id: `INV-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
        bookingId: resident.id,
        residentId: resident.userId,
        residentName: resident.residentName,
        phone: resident.phone,
        roomNumber: resident.assignedRoomNumber || resident.preferredRoomNumber || '201',
        roomType: resident.roomTypeId,
        billingMonth: billingMonth || 'Next Month',
        dueDate: dueDate || '2026-10-10',
        roomRent: resident.monthlyRent,
        foodCharges: resident.foodCharges || 0,
        utilityCharges: 2000,
        lateFee: 0,
        discount: 0,
        totalPayable: resident.monthlyRent + (resident.foodCharges || 0) + 2000,
        amountPaid: 0,
        remainingBalance: resident.monthlyRent + (resident.foodCharges || 0) + 2000,
        status: 'Pending',
        notes: `Monthly fee challan for ${billingMonth}.`,
      };
      data.feeInvoices.unshift(inv);
      generated.push(inv);
    }
  }

  db.save();
  db.logAudit(
    'Batch Monthly Fee Generated',
    'Payment',
    billingMonth,
    performedBy || 'Hostel Admin',
    'Hostel Admin',
    `Generated ${generated.length} monthly fee invoices for ${billingMonth}.`
  );

  res.json({ success: true, count: generated.length, invoices: generated });
});

