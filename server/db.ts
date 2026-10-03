import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
  ContactMessage,
  FeeInvoice,
} from '../src/types/index.js';
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
} from '../src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  config: HostelConfig;
  rooms: Room[];
  facilities: Facility[];
  food: FoodConfig;
  policies: HostelPolicyItem[];
  timings: HostelTimings;
  gallery: GalleryItem[];
  users: User[];
  bookings: Booking[];
  payments: Payment[];
  complaints: Complaint[];
  auditLogs: AuditLog[];
  contactMessages: ContactMessage[];
  feeInvoices: FeeInvoice[];
}

function getDefaultData(): DatabaseSchema {
  return {
    config: initialHostelConfig,
    rooms: initialRooms,
    facilities: initialFacilities,
    food: initialFoodConfig,
    policies: initialPolicies,
    timings: initialTimings,
    gallery: initialGallery,
    users: initialUsers,
    bookings: initialBookings,
    payments: initialPayments,
    complaints: initialComplaints,
    auditLogs: initialAuditLogs,
    feeInvoices: initialFeeInvoices,
    contactMessages: [
      {
        id: 'msg-1',
        name: 'Farhan Zaidi',
        phone: '+92 322 5566778',
        email: 'farhan.z@gmail.com',
        subject: 'Inquiry regarding 2-Seater Room for Fall Semester',
        message: 'Assalam-o-Alaikum, I am joining FAST-NUCES next month. Are 2-seater rooms available with attached bath?',
        createdAt: '2026-10-01T11:00:00.000Z',
        isRead: false,
      }
    ],
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          ...getDefaultData(),
          ...parsed,
        };
      }
    } catch (err) {
      console.error('Error loading database file, initializing default:', err);
    }
    const defaultData = getDefaultData();
    this.persist(defaultData);
    return defaultData;
  }

  private persist(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  public save(): void {
    this.persist(this.data);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // AUDIT LOG HELPER
  public logAudit(action: string, entityType: AuditLog['entityType'], entityId: string, performedBy: string, userRole: string, details: string, isPoliceAction = false) {
    const log: AuditLog = {
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
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }
}

export const db = new DatabaseManager();
