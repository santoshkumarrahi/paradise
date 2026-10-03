import React, { useState, useEffect } from 'react';
import {
  X,
  CalendarCheck,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Building,
  User,
  Phone,
  Mail,
  Home,
  FileText,
  DollarSign,
  Utensils,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { RoomType, Booking } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRoomType?: RoomType;
  preselectedRoomNumber?: string;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedRoomType = '2-seater',
  preselectedRoomNumber,
  onBookingSuccess,
}) => {
  const { rooms, food, config, createBooking } = useHostel();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Resident Details, Step 2: Room, Food & Summary Review
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [fatherGuardianName, setFatherGuardianName] = useState(currentUser?.guardianName || '');
  const [cnic, setCnic] = useState(currentUser?.cnic || '');
  const [dob, setDob] = useState('2003-04-15');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState(currentUser?.guardianName || '');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(currentUser?.guardianPhone || '');
  const [studentWorkerStatus, setStudentWorkerStatus] = useState<'Student' | 'Working Professional' | 'Other'>('Student');
  const [instituteCompany, setInstituteCompany] = useState(currentUser?.institute || '');

  // Room & Food Selection
  const [roomType, setRoomType] = useState<RoomType>(preselectedRoomType);
  const [preferredRoom, setPreferredRoom] = useState<string>(preselectedRoomNumber || '');
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [stayDurationMonths, setStayDurationMonths] = useState<number>(6);
  const [numberOfPersons, setNumberOfPersons] = useState<number>(1);
  const [foodRequired, setFoodRequired] = useState<boolean>(true);
  const [foodPackageType, setFoodPackageType] = useState<'None' | 'Full Board (3 Meals)' | 'Breakfast + Dinner'>('Full Board (3 Meals)');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Policy Acceptance
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [acceptedPaymentPolicy, setAcceptedPaymentPolicy] = useState(false);
  const [acceptedCancellationPolicy, setAcceptedCancellationPolicy] = useState(false);

  // Sync if preselected changes
  useEffect(() => {
    if (preselectedRoomType) setRoomType(preselectedRoomType);
    if (preselectedRoomNumber) setPreferredRoom(preselectedRoomNumber);
  }, [preselectedRoomType, preselectedRoomNumber]);

  if (!isOpen) return null;

  // Calculate pricing based on selected room type
  const matchingRooms = rooms.filter((r) => r.roomType === roomType);
  const baseMonthlyRent = matchingRooms.length ? matchingRooms[0].monthlyRent : 20000;
  const baseSecurityDeposit = matchingRooms.length ? matchingRooms[0].securityDeposit : 10000;
  const foodMonthlyCharge = foodRequired
    ? foodPackageType === 'Full Board (3 Meals)'
      ? food.monthlyPackagePrice
      : Math.round(food.monthlyPackagePrice * 0.7)
    : 0;
  const otherCharges = 1000; // Registration & ID card fee
  const totalInitialPayment = baseMonthlyRent + baseSecurityDeposit + foodMonthlyCharge + otherCharges;

  // Available room options of this type (excluding rooms where admin closed seats)
  const availableRoomsForType = matchingRooms.filter((r) => !r.seatsClosed && r.status === 'Available' && r.occupiedBeds < r.totalBeds);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName || !cnic || !phone || !email || !permanentAddress || !emergencyContactName || !emergencyContactNumber) {
      setErrorMsg('Please complete all mandatory personal and emergency contact details.');
      setStep(1);
      return;
    }

    if (!acceptedPolicies || !acceptedPaymentPolicy || !acceptedCancellationPolicy) {
      setErrorMsg('You must accept all hostel policies, payment terms, and cancellation rules before booking.');
      return;
    }

    try {
      setSubmitting(true);
      const newBooking = await createBooking({
        userId: currentUser?.id || `usr-${Date.now().toString().slice(-5)}`,
        residentName: fullName,
        fatherGuardianName,
        cnic,
        dob,
        gender,
        phone,
        whatsapp: whatsapp || phone,
        email,
        permanentAddress,
        emergencyContactName,
        emergencyContactNumber,
        studentWorkerStatus,
        instituteCompany,
        roomTypeId: roomType,
        preferredRoomNumber: preferredRoom || (availableRoomsForType[0]?.roomNumber ?? undefined),
        checkInDate,
        stayDurationMonths,
        numberOfPersons,
        foodRequired,
        foodPackageType: foodRequired ? foodPackageType : 'None',
        specialRequirements,
        monthlyRent: baseMonthlyRent,
        securityDeposit: baseSecurityDeposit,
        foodCharges: foodMonthlyCharge,
        otherCharges,
        totalInitialPayment,
        acceptedPolicies: true,
      });

      onBookingSuccess(newBooking);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Online Hostel Room Booking</h2>
              <p className="text-xs text-slate-400">Step {step} of 2 • {config.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-xs sm:text-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {step === 1 ? (
            /* STEP 1: PERSONAL & RESIDENTIAL INFORMATION */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Resident Personal Information</span>
                </h3>
                <span className="text-xs text-slate-400">All fields mandatory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name (as on CNIC) *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bilal Ahmad Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Father / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={fatherGuardianName}
                    onChange={(e) => setFatherGuardianName(e.target.value)}
                    placeholder="e.g. Ahmad Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">CNIC / B-Form Number *</label>
                  <input
                    type="text"
                    required
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="35201-1234567-1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Phone (Calling) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Permanent Home Address *</label>
                  <input
                    type="text"
                    required
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder="House number, Street, Tehsil/City, District"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* EMERGENCY & PROFESSIONAL DETAILS */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Emergency Contact & Professional Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Emergency Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="e.g. Father / Brother / Uncle"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Emergency Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={emergencyContactNumber}
                      onChange={(e) => setEmergencyContactNumber(e.target.value)}
                      placeholder="+92 300 7654321"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status *</label>
                    <select
                      value={studentWorkerStatus}
                      onChange={(e) => setStudentWorkerStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs bg-white"
                    >
                      <option value="Student">University / College Student</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Institute / University / Company *</label>
                    <input
                      type="text"
                      required
                      value={instituteCompany}
                      onChange={(e) => setInstituteCompany(e.target.value)}
                      placeholder="e.g. NUST / FAST / Software House"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!fullName || !phone || !email || !permanentAddress) {
                      setErrorMsg('Please fill in resident name, phone, email, and permanent address.');
                      return;
                    }
                    setErrorMsg(null);
                    setStep(2);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <span>Proceed to Room & Payment Summary</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: ROOM SELECTION, FOOD & BOOKING SUMMARY */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Room & Dining Preferences</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  ← Edit Personal Info
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Selected Room Category *</label>
                  <select
                    value={roomType}
                    onChange={(e) => {
                      setRoomType(e.target.value as RoomType);
                      setPreferredRoom('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs font-semibold bg-white"
                  >
                    <option value="1-seater">1-Seater Room (Single Occupancy)</option>
                    <option value="2-seater">2-Seater Room (Double Sharing)</option>
                    <option value="3-seater">3-Seater Room (Triple Sharing)</option>
                    <option value="4-seater">4-Seater Room (Quad Sharing)</option>
                  </select>
                </div>

                {availableRoomsForType.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <strong className="font-bold">Seats Currently Closed for {roomType.replace('-', ' ').toUpperCase()}:</strong>
                      <p className="text-[11px] text-rose-700 mt-0.5">
                        Admissions for this room type are currently closed or at full capacity. Please select an alternate room category or contact hostel management.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Preferred Room Number (Optional)</label>
                  <select
                    value={preferredRoom}
                    onChange={(e) => setPreferredRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs bg-white"
                  >
                    <option value="">First Available Bed in Category</option>
                    {availableRoomsForType.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.floor} • {r.totalBeds - r.occupiedBeds} beds free)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expected Stay Duration *</label>
                  <select
                    value={stayDurationMonths}
                    onChange={(e) => setStayDurationMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs bg-white"
                  >
                    <option value={1}>1 Month (Trial / Temporary)</option>
                    <option value={3}>3 Months (Quarterly Semester)</option>
                    <option value={6}>6 Months (Full Semester)</option>
                    <option value={12}>12 Months (Annual Resident)</option>
                  </select>
                </div>

                {/* Food Selection */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-amber-700" />
                      <span className="font-bold text-slate-900">Food Service Subscription</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={foodRequired}
                        onChange={(e) => setFoodRequired(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-slate-700">Include Mess Food</span>
                    </label>
                  </div>

                  {foodRequired && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <label className={`p-3 rounded-xl border cursor-pointer transition ${foodPackageType === 'Full Board (3 Meals)' ? 'bg-white border-amber-500 shadow-xs' : 'border-amber-200'}`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="foodPlan"
                            checked={foodPackageType === 'Full Board (3 Meals)'}
                            onChange={() => setFoodPackageType('Full Board (3 Meals)')}
                            className="text-amber-600"
                          />
                          <span className="font-bold text-slate-900">Full Board (3 Meals)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Breakfast, Lunch, and Dinner 7 days a week. PKR {food.monthlyPackagePrice.toLocaleString()}/mo.</p>
                      </label>

                      <label className={`p-3 rounded-xl border cursor-pointer transition ${foodPackageType === 'Breakfast + Dinner' ? 'bg-white border-amber-500 shadow-xs' : 'border-amber-200'}`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="foodPlan"
                            checked={foodPackageType === 'Breakfast + Dinner'}
                            onChange={() => setFoodPackageType('Breakfast + Dinner')}
                            className="text-amber-600"
                          />
                          <span className="font-bold text-slate-900">Breakfast + Dinner</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Ideal for day-time university students. PKR {Math.round(food.monthlyPackagePrice * 0.7).toLocaleString()}/mo.</p>
                      </label>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Special Requirements / Notes (Optional)</label>
                  <input
                    type="text"
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="e.g. Ground floor preferred, lower bed preference, quiet study partner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* BOOKING SUMMARY BREAKDOWN (Exact Section 17 Requirement) */}
              <div className="rounded-2xl bg-slate-900 text-white p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Booking Payment Summary</span>
                  <span className="text-xs text-slate-400">All prices in Pakistani Rupees (PKR)</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Room: <strong className="text-white capitalize">{roomType}</strong></span>
                    <span>PKR {baseMonthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refundable Security Deposit:</span>
                    <span>PKR {baseSecurityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food Service ({foodRequired ? foodPackageType : 'None'}):</span>
                    <span>PKR {foodMonthlyCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration & Verification ID Card:</span>
                    <span>PKR {otherCharges.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 flex items-baseline justify-between">
                  <span className="font-extrabold text-sm text-white">Total Initial Payment:</span>
                  <span className="text-xl font-black text-emerald-400">
                    PKR {totalInitialPayment.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* MANDATORY POLICY ACCEPTANCE (Exact Section 17 & 53 Requirement) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <p className="font-bold text-slate-900">Mandatory Terms & Policy Consent:</p>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedPolicies}
                    onChange={(e) => setAcceptedPolicies(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I accept the <strong>Hostel Rules, Quiet Hours, and Code of Conduct</strong>.</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedPaymentPolicy}
                    onChange={(e) => setAcceptedPaymentPolicy(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I agree to the <strong>Payment Policy</strong>: Uploading a payment screenshot initiates verification; possession is granted only upon verified reconciliation.</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedCancellationPolicy}
                    onChange={(e) => setAcceptedCancellationPolicy(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I agree to the <strong>Cancellation & Refund Policy</strong>: Security deposit is refundable subject to 15-day prior written notice.</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 text-xs hover:bg-slate-100 transition"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={submitting || !acceptedPolicies || !acceptedPaymentPolicy || !acceptedCancellationPolicy}
                  className={`px-8 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-lg ${
                    submitting || !acceptedPolicies || !acceptedPaymentPolicy || !acceptedCancellationPolicy
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20 active:scale-98 cursor-pointer'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Application...' : 'Confirm & Generate Booking ID'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
