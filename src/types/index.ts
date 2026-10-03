export type UserRole = 'Super Admin' | 'Hostel Admin' | 'Manager' | 'Staff' | 'Security' | 'Student/Resident';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roomNumber?: string;
  cnic?: string;
  guardianName?: string;
  guardianPhone?: string;
  institute?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type RoomType = '1-seater' | '2-seater' | '3-seater' | '4-seater';
export type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance' | 'Unavailable';

export interface RoomBed {
  bedNumber: string; // e.g. "Bed-1", "Bed-2"
  status: 'Vacant' | 'Occupied' | 'Closed' | 'Maintenance';
  residentName?: string;
  residentPhone?: string;
  assignedBookingId?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  floor: string;
  capacity: number;
  totalBeds: number;
  occupiedBeds: number;
  monthlyRent: number;
  securityDeposit: number;
  status: RoomStatus;
  attachedWashroom: boolean;
  balcony: boolean;
  hasAC: boolean;
  amenities: string[];
  images: string[];
  description: string;
  seatsClosed?: boolean; // When true, admin has locked admissions / closed all seats for this room
  closedReason?: string; // e.g. "Reserved for semester cohort" or "Annual inspection"
  beds?: RoomBed[];
}

export type FeeStatus = 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';

export interface FeeInvoice {
  id: string; // e.g. INV-2026-1001
  bookingId?: string;
  residentId: string;
  residentName: string;
  phone: string;
  roomNumber: string;
  roomType: RoomType;
  billingMonth: string; // e.g. "October 2026"
  dueDate: string; // e.g. "2026-10-10"
  roomRent: number;
  foodCharges: number;
  utilityCharges: number;
  lateFee: number;
  discount: number;
  totalPayable: number;
  amountPaid: number;
  remainingBalance: number;
  status: FeeStatus;
  paymentMethod?: PaymentMethod | 'Cash';
  transactionReference?: string;
  receiptNumber?: string;
  paidAt?: string;
  recordedBy?: string;
  notes?: string;
}

export type BookingStatus =
  | 'Pending'
  | 'Payment Pending'
  | 'Under Verification'
  | 'Confirmed'
  | 'Checked In'
  | 'Checked Out'
  | 'Cancelled'
  | 'Rejected';

export type PaymentStatus =
  | 'Unpaid'
  | 'Payment Pending'
  | 'Verification Pending'
  | 'Payment Verified'
  | 'Payment Failed'
  | 'Refunded'
  | 'Cancelled';

export type PaymentMethod = 'JazzCash' | 'Easypaisa' | 'Bank Transfer';

export interface Booking {
  id: string; // e.g. BK-PK-2026-101
  userId: string;
  residentName: string;
  fatherGuardianName: string;
  cnic: string;
  dob: string;
  gender: 'Male' | 'Female';
  phone: string;
  whatsapp: string;
  email: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  studentWorkerStatus: 'Student' | 'Working Professional' | 'Other';
  instituteCompany: string;
  roomTypeId: RoomType;
  roomId?: string;
  preferredRoomNumber?: string;
  assignedRoomNumber?: string;
  checkInDate: string;
  stayDurationMonths: number;
  numberOfPersons: number;
  foodRequired: boolean;
  foodPackageType: 'None' | 'Full Board (3 Meals)' | 'Breakfast + Dinner';
  specialRequirements?: string;
  monthlyRent: number;
  securityDeposit: number;
  foodCharges: number;
  otherCharges: number;
  totalInitialPayment: number;
  acceptedPolicies: boolean;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
  notes?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  residentName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  transactionId: string;
  senderAccountTitle: string;
  senderAccountNumber: string;
  recipientAccount: string;
  receiptImageUrl?: string;
  status: PaymentStatus;
  adminRemarks?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'Cleanliness'
  | 'Room'
  | 'Maintenance'
  | 'Electricity'
  | 'Water'
  | 'Wi-Fi'
  | 'Food'
  | 'Washroom'
  | 'Noise'
  | 'Staff Behavior'
  | 'Security'
  | 'Harassment'
  | 'Threats'
  | 'Physical Violence'
  | 'Theft'
  | 'Sexual Harassment/Abuse'
  | 'Illegal Activity'
  | 'Missing Person'
  | 'Emergency'
  | 'Other';

export type ComplaintSeverity = 'Normal' | 'Serious' | 'Emergency';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'In Progress'
  | 'Escalated to Police'
  | 'Resolved'
  | 'Closed';

export type PoliceEscalationStatus =
  | 'Not Escalated'
  | 'Submitted'
  | 'Forwarded'
  | 'Received by Authority'
  | 'Under Investigation'
  | 'Action Taken'
  | 'Resolved'
  | 'Closed';

export interface EvidenceFile {
  name: string;
  url: string;
  type: string;
  size?: string;
}

export interface Complaint {
  id: string; // e.g. CMP-9041
  userId: string;
  studentName: string;
  studentPhone: string;
  roomNumber: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  description: string;
  incidentDate: string;
  incidentLocation: string;
  evidenceFiles: EvidenceFile[];
  isConfidential: boolean;
  requestPoliceEscalation: boolean;
  status: ComplaintStatus;
  policeJurisdiction?: string;
  policeStation?: string;
  policeReferenceNumber?: string;
  policeSubmissionDate?: string;
  policeStatus?: PoliceEscalationStatus;
  policeFeedbackNotes?: string;
  adminNotes?: string;
  assignedStaff?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'Complaint' | 'Booking' | 'Payment' | 'Room' | 'System' | 'Resident' | 'HostelConfig';
  entityId: string;
  performedBy: string;
  userRole: string;
  details: string;
  timestamp: string;
  isPoliceAction: boolean;
}

export interface Facility {
  id: string;
  name: string;
  category: 'Power' | 'Connectivity' | 'Hygiene' | 'Living' | 'Security' | 'Convenience';
  icon: string;
  description: string;
  isFree: boolean;
  priceNote?: string;
  isEnabled: boolean;
  highlightInHero: boolean;
}

export interface FoodMenuItem {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface FoodConfig {
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  monthlyPackagePrice: number;
  breakfastTiming: string;
  lunchTiming: string;
  dinnerTiming: string;
  hygieneStandard: string;
  isFoodServiceActive: boolean;
  menu: FoodMenuItem[];
}

export interface HostelPolicyItem {
  id: string;
  title: string;
  category: 'Check-in/out' | 'Payment' | 'Visitors' | 'Cleanliness' | 'Noise' | 'Electricity' | 'Food' | 'Cancellation' | 'Damage' | 'Prohibited';
  description: string;
  rules: string[];
}

export interface HostelTimings {
  checkIn: string;
  checkOut: string;
  visitorHours: string;
  breakfastHours: string;
  lunchHours: string;
  dinnerHours: string;
  quietHours: string;
  receptionHours: string;
  cleaningHours: string;
  managementHours: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Exterior' | 'Rooms' | 'Washrooms' | 'Kitchen' | 'Food' | 'Common Area' | 'Study Area' | 'Facilities' | 'Location';
  imageUrl: string;
  caption: string;
}

export interface PaymentAccountsConfig {
  jazzCash: {
    accountTitle: string;
    accountNumber: string;
    merchantId?: string;
    qrImageUrl?: string;
    instructions: string;
  };
  easypaisa: {
    accountTitle: string;
    accountNumber: string;
    merchantId?: string;
    qrImageUrl?: string;
    instructions: string;
  };
  bankTransfer: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchName: string;
    branchCode: string;
    instructions: string;
  };
}

export interface PoliceJurisdictionConfig {
  country: string;
  province: string;
  city: string;
  district: string;
  policeStation: string;
  stationAddress: string;
  officialPolicePhone: string;
  stationDirectPhone: string;
  officialComplaintPortal: string;
  portalName: string;
  apiAvailable: boolean;
  apiStatus: 'Operational' | 'Degraded' | 'Offline';
  cplcHelpline: string;
  rescueAmbulance: string;
  fireBrigade: string;
  hostelEmergencyPhone: string;
  hostelManagerName: string;
  hostelManagerPhone: string;
  hostelSecuritySupervisor: string;
  hostelSecurityPhone: string;
}

export interface HostelConfig {
  id: string;
  name: string;
  tagline: string;
  aboutIntro: string;
  aboutEnvironment: string;
  aboutSafety: string;
  aboutCleanliness: string;
  aboutManagement: string;
  address: string;
  area: string;
  city: string;
  district: string;
  province: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  currency: string;
  electricityStatus: string;
  electricityBackupType: string;
  electricityBackupDuration: string;
  electricityPolicy: string;
  wifiSpeed: string;
  wifiCoverage: string;
  wifiUsageRules: string;
  waterSupplyType: string;
  waterCleanliness: string;
  waterCoolerLocations: string;
  cleanlinessSchedule: string;
  wasteManagement: string;
  ironFacilityDescription: string;
  laundryServiceDescription: string;
  paymentAccounts: PaymentAccountsConfig;
  policeConfig: PoliceJurisdictionConfig;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  totalResidents: number;
  pendingBookings: number;
  confirmedBookings: number;
  pendingPayments: number;
  verifiedPayments: number;
  totalRevenuePKR: number;
  pendingComplaints: number;
  seriousComplaints: number;
  emergencyComplaints: number;
  resolvedComplaints: number;
  policeEscalations: number;
}
