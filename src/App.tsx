import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HostelProvider, useHostel } from './context/HostelContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { StickyMobileBar } from './components/common/EmergencyBanner';
import { ToastContainer } from './components/common/ToastContainer';

// Home & Subsections
import { Hero } from './components/home/Hero';
import { QuickFacilities } from './components/home/QuickFacilities';
import { AboutSection } from './components/home/AboutSection';
import { LocationSection } from './components/home/LocationSection';
import { RoomCards } from './components/rooms/RoomCards';
import { RoomComparison } from './components/rooms/RoomComparison';

// Dedicated Pages
import { FacilitiesPage } from './components/facilities/FacilitiesPage';
import { FoodPage } from './components/food/FoodPage';
import { PoliciesPage } from './components/policies/PoliciesPage';
import { GalleryPage } from './components/gallery/GalleryPage';
import { ComplaintsPage } from './components/complaints/ComplaintsPage';
import { EmergencyPage } from './components/emergency/EmergencyPage';
import { ContactPage } from './components/contact/ContactPage';

// Dashboards
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals
import { BookingModal } from './components/booking/BookingModal';
import { PaymentModal } from './components/booking/PaymentModal';
import { BookingConfirmationModal } from './components/booking/BookingConfirmationModal';
import { ComplaintFormModal } from './components/complaints/ComplaintFormModal';
import { ComplaintDetailsModal } from './components/complaints/ComplaintDetailsModal';
import { AuthModal } from './components/auth/AuthModal';

import { RoomType, Booking, Complaint } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals visibility
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [complaintFormOpen, setComplaintFormOpen] = useState(false);
  const [complaintDetailsOpen, setComplaintDetailsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Modal active objects
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('2-seater');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string | undefined>();
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  const handleOpenBooking = (roomType: RoomType = '2-seater', roomNumber?: string) => {
    setSelectedRoomType(roomType);
    setSelectedRoomNumber(roomNumber);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setActiveBooking(newBooking);
    setConfirmationModalOpen(true);
  };

  const handleProceedToPayment = (booking: Booking) => {
    setActiveBooking(booking);
    setPaymentModalOpen(true);
  };

  const handleViewComplaintDetails = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    setComplaintDetailsOpen(true);
  };

  const handleViewBookingVoucher = (booking: Booking) => {
    setActiveBooking(booking);
    setConfirmationModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white pb-16 xl:pb-0">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        onOpenComplaint={() => setComplaintFormOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <>
            <Hero
              onOpenBooking={() => handleOpenBooking()}
              onViewRooms={() => {
                const el = document.getElementById('rooms-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('rooms');
              }}
              onContactHostel={() => setActiveTab('contact')}
            />

            <QuickFacilities
              onViewAllFacilities={() => {
                setActiveTab('facilities');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <RoomCards
              onSelectRoomForBooking={(type, num) => handleOpenBooking(type, num)}
            />

            <RoomComparison
              onSelectRoomForBooking={(type) => handleOpenBooking(type)}
            />

            <AboutSection
              onOpenBooking={() => handleOpenBooking()}
              onViewPolicies={() => {
                setActiveTab('policies');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <LocationSection />
          </>
        )}

        {/* TAB 2: ABOUT HOSTEL */}
        {activeTab === 'about' && (
          <div className="py-8">
            <AboutSection
              onOpenBooking={() => handleOpenBooking()}
              onViewPolicies={() => setActiveTab('policies')}
            />
            <LocationSection />
          </div>
        )}

        {/* TAB 3: ROOMS & COMPARISON */}
        {activeTab === 'rooms' && (
          <div className="py-8 space-y-12">
            <RoomCards
              onSelectRoomForBooking={(type, num) => handleOpenBooking(type, num)}
            />
            <RoomComparison
              onSelectRoomForBooking={(type) => handleOpenBooking(type)}
            />
          </div>
        )}

        {/* TAB 4: FACILITIES */}
        {activeTab === 'facilities' && (
          <FacilitiesPage onOpenBooking={() => handleOpenBooking()} />
        )}

        {/* TAB 5: FOOD & MESS */}
        {activeTab === 'food' && (
          <FoodPage onOpenBooking={() => handleOpenBooking()} />
        )}

        {/* TAB 6: HOSTEL POLICIES & TIMINGS */}
        {activeTab === 'policies' && <PoliciesPage />}

        {/* TAB 7: GALLERY */}
        {activeTab === 'gallery' && <GalleryPage />}

        {/* TAB 8: COMPLAINTS & POLICE PORTAL */}
        {activeTab === 'complaints' && (
          <ComplaintsPage
            onOpenComplaintForm={() => setComplaintFormOpen(true)}
            onViewComplaintDetails={handleViewComplaintDetails}
          />
        )}

        {/* TAB 9: EMERGENCY & POLICE JURISDICTION */}
        {activeTab === 'emergency' && (
          <EmergencyPage onOpenComplaint={() => setComplaintFormOpen(true)} />
        )}

        {/* TAB 10: CONTACT US */}
        {activeTab === 'contact' && <ContactPage />}

        {/* TAB 11: STUDENT DASHBOARD */}
        {activeTab === 'student-dashboard' && (
          <StudentDashboard
            onOpenBooking={() => handleOpenBooking()}
            onOpenComplaint={() => setComplaintFormOpen(true)}
            onViewBookingVoucher={handleViewBookingVoucher}
            onOpenPaymentModal={handleProceedToPayment}
            onViewComplaintDetails={handleViewComplaintDetails}
          />
        )}

        {/* TAB 12: ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            onViewBookingVoucher={handleViewBookingVoucher}
            onViewComplaintDetails={handleViewComplaintDetails}
          />
        )}
      </main>

      {/* Global Footer with Final CTA */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => handleOpenBooking()}
        onOpenComplaint={() => setComplaintFormOpen(true)}
      />

      {/* Mobile Sticky Action Bar */}
      <StickyMobileBar
        onOpenBooking={() => handleOpenBooking()}
        onOpenComplaint={() => setComplaintFormOpen(true)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedRoomType={selectedRoomType}
        preselectedRoomNumber={selectedRoomNumber}
        onBookingSuccess={handleBookingSuccess}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        booking={activeBooking}
        onPaymentSuccess={() => {
          if (activeBooking) {
            setActiveBooking({ ...activeBooking, paymentStatus: 'Verification Pending', bookingStatus: 'Under Verification' });
          }
        }}
      />

      <BookingConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        booking={activeBooking}
        onProceedToPayment={handleProceedToPayment}
      />

      <ComplaintFormModal
        isOpen={complaintFormOpen}
        onClose={() => setComplaintFormOpen(false)}
        onComplaintSubmitted={handleViewComplaintDetails}
      />

      <ComplaintDetailsModal
        isOpen={complaintDetailsOpen}
        onClose={() => setComplaintDetailsOpen(false)}
        complaint={activeComplaint}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HostelProvider>
        <AppContent />
      </HostelProvider>
    </AuthProvider>
  );
}
