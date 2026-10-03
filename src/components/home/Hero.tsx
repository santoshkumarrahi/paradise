import React, { useState } from 'react';
import {
  CalendarCheck,
  Building,
  PhoneCall,
  Zap,
  Wifi,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
  Star,
  ArrowRight,
  Search,
  Utensils,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  SlidersHorizontal,
  Clock,
  ShieldAlert,
  MessageSquare,
  Users,
  GraduationCap,
  Bed,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { RoomType } from '../../types';

interface HeroProps {
  onOpenBooking: () => void;
  onViewRooms: () => void;
  onContactHostel: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onViewRooms, onContactHostel }) => {
  const { config, rooms, food, gallery } = useHostel();

  // Active Hero Design Variant: persistent in localStorage so the user's preferred design stays
  const [heroLayout, setHeroLayout] = useState<'engine' | 'slider' | 'bento' | 'campus' | 'split_rooms'>(() => {
    try {
      const saved = localStorage.getItem('pakhostel_hero_layout');
      if (saved && ['engine', 'slider', 'bento', 'campus', 'split_rooms'].includes(saved)) {
        return saved as any;
      }
    } catch (e) {
      // ignore
    }
    return 'slider';
  });

  const handleSelectLayout = (layout: 'engine' | 'slider' | 'bento' | 'campus' | 'split_rooms') => {
    setHeroLayout(layout);
    try {
      localStorage.setItem('pakhostel_hero_layout', layout);
    } catch (e) {
      // ignore
    }
  };

  // Quick availability widget state inside the hero
  const [searchRoomType, setSearchRoomType] = useState<RoomType>('2-seater');
  const [includeFood, setIncludeFood] = useState<boolean>(true);
  const [searchCheckIn, setSearchCheckIn] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  // Photo slider active tab
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Available beds count
  const availableBeds = rooms.reduce((acc, r) => acc + Math.max(0, r.totalBeds - r.occupiedBeds), 0);

  // Dynamic price calculation for quick search bar
  const selectedRoomDetails = rooms.find((r) => r.roomType === searchRoomType) || rooms[0];
  const calculatedMonthlyRent = selectedRoomDetails?.monthlyRent || 20000;
  const calculatedFoodPrice = includeFood ? food.monthlyPackagePrice : 0;
  const calculatedTotalMonthly = calculatedMonthlyRent + calculatedFoodPrice;

  // DYNAMIC SLIDES: Built directly from user/admin added gallery photos and room photos!
  const slides = React.useMemo(() => {
    const list: {
      id: string;
      title: string;
      subtitle: string;
      image: string;
      badge: string;
      price: string;
      category?: string;
    }[] = [];

    // 1. First priority: Real gallery photos added in hostel gallery
    if (gallery && gallery.length > 0) {
      gallery.forEach((g) => {
        let price = 'Included';
        if (g.category === 'Food') {
          price = `PKR ${food.monthlyPackagePrice.toLocaleString()}/mo`;
        } else if (g.category === 'Rooms') {
          price = `From PKR 22,000/mo`;
        } else if (g.category === 'Exterior') {
          price = `${config.area}, ${config.city}`;
        } else {
          price = 'Verified';
        }

        list.push({
          id: g.id,
          title: g.title,
          subtitle: g.caption || `${g.category} at ${config.name}`,
          image: g.imageUrl,
          badge: g.category,
          price,
          category: g.category,
        });
      });
    }

    // 2. Add all unique photos from rooms
    rooms.forEach((r) => {
      (r.images || []).forEach((imgUrl, idx) => {
        if (!list.some((item) => item.image === imgUrl)) {
          list.push({
            id: `room-${r.id}-${idx}`,
            title: `Room ${r.roomNumber} (${r.roomType.replace('-', ' ')})`,
            subtitle: `${r.floor} • Capacity ${r.capacity} Person(s) • ${r.amenities.slice(0, 3).join(', ')}`,
            image: imgUrl,
            badge: `Room ${r.roomNumber}`,
            price: `PKR ${r.monthlyRent.toLocaleString()}/mo`,
            category: 'Rooms',
          });
        }
      });
    });

    // 3. Fallback slides if none exists
    if (list.length === 0) {
      return [
        {
          id: 'def-1',
          title: 'Executive Single Seater Rooms',
          subtitle: 'Maximum privacy, study desk, split AC & attached geyser bath',
          image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
          badge: '1-Seater Suite',
          price: 'PKR 32,000/mo',
        },
        {
          id: 'def-2',
          title: 'Spacious 2-Seater Double Sharing',
          subtitle: 'Twin single beds, individual study desks, and private balcony view',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
          badge: '2-Seater Suite',
          price: 'PKR 22,000/mo',
        },
        {
          id: 'def-3',
          title: 'Hygienic Mess & Fresh Desi Meals',
          subtitle: 'Nutritious breakfast, lunch & dinner prepared with verified cooking oils',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
          badge: '3 Meals Daily',
          price: 'PKR 14,000/mo',
        },
        {
          id: 'def-4',
          title: 'Distraction-Free Quiet Study Hall',
          subtitle: '100 Mbps fiber mesh Wi-Fi, ergonomic chairs & backup solar power',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          badge: '24/7 Library',
          price: 'Included Free',
        },
      ];
    }

    return list;
  }, [gallery, rooms, food, config]);

  // Safe active slide index
  const safeSlideIndex = activeSlide >= slides.length ? 0 : activeSlide;
  const currentSlide = slides[safeSlideIndex] || slides[0];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white transition-all duration-500">
      {/* Ambient background glows */}
      <div className="absolute -top-24 left-1/3 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Design Switcher Pill (Gives user immediate control to see and test 5 different hero designs!) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-20">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Active Hero Design:</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
            {slides.length} Photos Synced
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => handleSelectLayout('engine')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              heroLayout === 'engine'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Design 1: Booking Search
          </button>
          <button
            onClick={() => handleSelectLayout('slider')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              heroLayout === 'slider'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Design 2: Photo Slider
          </button>
          <button
            onClick={() => handleSelectLayout('bento')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              heroLayout === 'bento'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Design 3: Bento Showcase
          </button>
          <button
            onClick={() => handleSelectLayout('campus')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              heroLayout === 'campus'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Design 4: Campus & Admissions
          </button>
          <button
            onClick={() => handleSelectLayout('split_rooms')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              heroLayout === 'split_rooms'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Design 5: Room Seat Showcase
          </button>
        </div>
      </div>

      {/* =========================================================================
          DESIGN 1: BOOKING SEARCH ENGINE & DYNAMIC AVAILABILITY (HIGH CONVERSION)
         ========================================================================= */}
      {heroLayout === 'engine' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 lg:pt-14 lg:pb-28 relative z-10 space-y-12 animate-in fade-in duration-300">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{config.city}, Pakistan • Admissions & Bookings Open</span>
            </div>

            {/* Exact Required Headline from brief */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Comfortable, Clean & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Affordable</span> Hostel Living
            </h1>

            {/* Exact Required Subtitle from brief */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Safe rooms, reliable facilities, Wi-Fi, electricity, clean water, food and professional hostel management.
            </p>

            {/* Quick 3 Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:scale-102 active:scale-98 transition flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book a Room</span>
              </button>

              <button
                onClick={onViewRooms}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Building className="w-4 h-4 text-emerald-400" />
                <span>View Rooms</span>
              </button>

              <button
                onClick={onContactHostel}
                className="px-5 py-3.5 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Contact Hostel</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC REAL-TIME BOOKING & AVAILABILITY SEARCH BAR */}
          <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-white/20 backdrop-blur-xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Search className="w-4 h-4" />
                <span>Live Room Availability & Price Calculator</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <strong>{availableBeds} Beds</strong> Available Today
                </span>
                <span className="hidden sm:inline text-slate-500">|</span>
                <span className="hidden sm:inline">No Hidden Broker Commission</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Room Type */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  1. Room Type
                </label>
                <select
                  value={searchRoomType}
                  onChange={(e) => setSearchRoomType(e.target.value as RoomType)}
                  className="w-full bg-slate-800 text-white font-bold rounded-xl px-2.5 py-2 border border-white/15 focus:outline-emerald-500"
                >
                  <option value="1-seater">1-Seater (Private Room)</option>
                  <option value="2-seater">2-Seater (Double Sharing)</option>
                  <option value="3-seater">3-Seater (Triple Sharing)</option>
                  <option value="4-seater">4-Seater (Quad Suite)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Capacity: {searchRoomType === '1-seater' ? '1 Person' : searchRoomType === '2-seater' ? '2 Persons' : searchRoomType === '3-seater' ? '3 Persons' : '4 Persons'}
                </span>
              </div>

              {/* Food Plan */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  2. Food & Mess Service
                </label>
                <select
                  value={includeFood ? 'yes' : 'no'}
                  onChange={(e) => setIncludeFood(e.target.value === 'yes')}
                  className="w-full bg-slate-800 text-white font-bold rounded-xl px-2.5 py-2 border border-white/15 focus:outline-emerald-500"
                >
                  <option value="yes">Include 3 Meals (+PKR {food.monthlyPackagePrice.toLocaleString()})</option>
                  <option value="no">Room Only (No Food)</option>
                </select>
                <span className="text-[10px] text-amber-300 mt-1 block">
                  {includeFood ? 'Full 7-day desi menu included' : 'Optional separate meal purchase'}
                </span>
              </div>

              {/* Check-In Date */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  3. Expected Check-In
                </label>
                <input
                  type="date"
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                  className="w-full bg-slate-800 text-white font-bold rounded-xl px-2.5 py-2 border border-white/15 focus:outline-emerald-500 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Immediate keys & biometric register
                </span>
              </div>

              {/* Action Button & Live Total */}
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-300">Estimated Monthly:</span>
                  <p className="text-xl font-black text-white mt-0.5">
                    PKR {calculatedTotalMonthly.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </p>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer mt-1"
                >
                  <span>Book This Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick trust row */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Security deposit 100% refundable upon checkout clearance
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Official Pakistani payments: JazzCash, Easypaisa & Bank IBFT
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Linked to {config.policeConfig.policeStation} (15)
              </span>
            </div>
          </div>

          {/* Social Proof & Rating Strip */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="font-extrabold text-sm text-white">4.9 / 5 Rating</p>
              <p className="text-[11px] text-slate-400">350+ Student Residents</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="font-extrabold text-sm text-white">24/7 Power</p>
              <p className="text-[11px] text-slate-400">Solar + Generator UPS</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Wifi className="w-5 h-5 text-sky-400 mx-auto mb-1" />
              <p className="font-extrabold text-sm text-white">100 Mbps</p>
              <p className="text-[11px] text-slate-400">Low-Latency Mesh Wi-Fi</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Droplets className="w-5 h-5 text-teal-400 mx-auto mb-1" />
              <p className="font-extrabold text-sm text-white">7-Stage RO</p>
              <p className="text-[11px] text-slate-400">Mineral Sweet Water</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DESIGN 2: SPLIT HERO WITH INTERACTIVE PHOTO SLIDER (VISUAL SHOWCASE)
         ========================================================================= */}
      {heroLayout === 'slider' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 lg:pt-16 lg:pb-28 relative z-10 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Building className="w-3.5 h-3.5" />
                <span>Executive Living • Sector {config.area}, {config.city}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Comfortable, Clean & <span className="text-emerald-400">Affordable</span> Hostel Living
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Safe rooms, reliable facilities, Wi-Fi, electricity, clean water, food and professional hostel management.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Individual single, 2-seater, 3-seater & 4-seater furnished rooms</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24-Hour automatic solar hybrid & generator backup electricity</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct emergency connection to Rescue 15 & Rescue 1122</span>
                </div>
              </div>

              {/* Required Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-700/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book a Room</span>
                </button>

                <button
                  onClick={onViewRooms}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>View Rooms</span>
                </button>

                <button
                  onClick={onContactHostel}
                  className="px-5 py-4 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Contact Hostel</span>
                </button>
              </div>

              {/* WhatsApp direct ping */}
              <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
                <a
                  href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam-o-Alaikum, I am inquiring about room availability at ' + config.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-semibold hover:text-white transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ask Instant Question on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right: Interactive Photo Slider */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900 aspect-[16/11]">
                <img
                  src={slides[activeSlide].image}
                  alt={slides[activeSlide].title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/15">
                  {slides[activeSlide].badge}
                </div>

                <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-lg">
                  {slides[activeSlide].price}
                </div>

                {/* Bottom slide info */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15">
                  <h3 className="font-extrabold text-base text-white">{slides[activeSlide].title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{slides[activeSlide].subtitle}</p>
                </div>
              </div>

              {/* Slider Thumbnail Selectors */}
              <div className="grid grid-cols-4 gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`p-2 rounded-2xl border text-left transition cursor-pointer ${
                      activeSlide === idx
                        ? 'bg-emerald-950/80 border-emerald-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <p className="font-bold text-[11px] truncate">{s.badge}</p>
                    <span className="text-[10px] text-emerald-400 font-medium block">{s.price.split('/')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DESIGN 3: BENTO LUXURY SHOWCASE (MODERN SAAS / REAL ESTATE LOOK)
         ========================================================================= */}
      {heroLayout === 'bento' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 lg:pt-14 lg:pb-28 relative z-10 space-y-10 animate-in fade-in duration-300">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
              Verified Student & Professional Residence
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Comfortable, Clean & <span className="text-emerald-400">Affordable</span> Hostel Living
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Safe rooms, reliable facilities, Wi-Fi, electricity, clean water, food and professional hostel management.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-700/30 transition flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book a Room</span>
              </button>

              <button
                onClick={onViewRooms}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Building className="w-4 h-4 text-emerald-400" />
                <span>View Rooms</span>
              </button>

              <button
                onClick={onContactHostel}
                className="px-5 py-3.5 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Contact Hostel</span>
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Big Bento Item 1: Main Photo */}
            <div className="md:col-span-2 lg:col-span-2 relative rounded-3xl overflow-hidden border border-white/15 aspect-[16/11] bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80"
                alt="Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Furnished Bedrooms</span>
                <h3 className="text-xl font-bold mt-1">1, 2, 3 & 4-Seater Rooms</h3>
                <p className="text-xs text-slate-300 mt-1">Starting from PKR 13,000/mo with attached bath & study tables.</p>
              </div>
            </div>

            {/* Bento Item 2: 24h Electricity Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Zero Load-Shedding</span>
                <h3 className="text-lg font-bold text-white mt-1">24-Hour Electricity</h3>
                <p className="text-xs text-slate-300 mt-1">Solar hybrid + 30kVA Generator + UPS instant sub-second backup.</p>
              </div>
            </div>

            {/* Bento Item 3: Police & Safety */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500/20 via-slate-900 to-slate-900 border border-red-500/30 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] uppercase font-bold text-red-300 tracking-wider">Rescue 15 Linked</span>
                <h3 className="text-lg font-bold text-white mt-1">Official Police Station</h3>
                <p className="text-xs text-slate-300 mt-1">{config.policeConfig.policeStation} with electronic complaint routing.</p>
              </div>
            </div>

            {/* Bento Item 4: Clean RO Water */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-500/20 via-slate-900 to-slate-900 border border-teal-500/30 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Pure Mineral Water</span>
                <h3 className="text-lg font-bold text-white mt-1">7-Stage RO Plant</h3>
                <p className="text-xs text-slate-300 mt-1">Chilled water coolers and stainless steel water stations on each floor.</p>
              </div>
            </div>

            {/* Bento Item 5: Food Service */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Hygienic Mess</span>
                <h3 className="text-lg font-bold text-white mt-1">Nutritious Food</h3>
                <p className="text-xs text-slate-300 mt-1">Fresh halal breakfast, lunch & dinner with independent monthly package.</p>
              </div>
            </div>

            {/* Bento Item 6: Fast Wi-Fi & Study */}
            <div className="md:col-span-2 lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-900 border border-sky-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Wifi className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">
                  100 Mbps Dedicated
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] uppercase font-bold text-sky-300 tracking-wider">Campus Mesh Network</span>
                <h3 className="text-xl font-bold text-white mt-1">High-Speed Study Wi-Fi</h3>
                <p className="text-xs text-slate-300 mt-1">Low-latency fiber optic connection on every corridor for zoom lectures and research.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          DESIGN 4: PAKISTANI UNIVERSITY & ADMISSIONS HUB (STUDENT & PARENT TRUST)
         ========================================================================= */}
      {heroLayout === 'campus' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 lg:pt-14 lg:pb-28 relative z-10 space-y-12 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Campus pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Semester Admissions Open • HEC & Police Verified</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Comfortable, Clean & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Affordable</span> Hostel Living
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Safe rooms, reliable facilities, Wi-Fi, electricity, clean water, food and professional hostel management.
              </p>

              {/* University Campus Distance Pills (Tailored for Pakistani Students) */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Nearby Universities & Metro Transit:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" /> NUST H-12 (8 mins)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" /> FAST-NUCES (12 mins)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" /> COMSATS / QAU (15 mins)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Metro Bus Station (3 mins)
                  </span>
                </div>
              </div>

              {/* Required 3 CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenBooking}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-700/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book a Room Online</span>
                </button>

                <button
                  onClick={onViewRooms}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>View Rooms</span>
                </button>

                <button
                  onClick={onContactHostel}
                  className="px-5 py-4 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Contact Hostel</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-white/10">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Police Station {config.policeConfig.policeStation}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> JazzCash & Easypaisa Instant
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Zap className="w-4 h-4 text-amber-400" /> 24/7 Solar & Gen Backup
                </span>
              </div>
            </div>

            {/* Right Admissions Card with Seat Counter */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-slate-900/90 border border-white/20 backdrop-blur-xl p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Live Admissions Desk
                    </span>
                    <h3 className="text-xl font-black text-white mt-0.5">Fall / Spring Intake</h3>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                    ● Admissions Active
                  </div>
                </div>

                {/* Available Seats Pill Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300">Overall Vacancy:</span>
                    <p className="text-2xl font-black text-white mt-0.5">
                      {availableBeds} Seats Free
                    </p>
                    <span className="text-[10px] text-emerald-400">Across 1, 2, 3 & 4-seater categories</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold">
                    <Bed className="w-6 h-6" />
                  </div>
                </div>

                {/* Pricing highlights table */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">1-Seater Private Room</span>
                    <strong className="text-white font-mono">PKR 32,000/mo</strong>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">2-Seater Double Sharing</span>
                    <strong className="text-emerald-400 font-mono">PKR 22,000/mo</strong>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">3-Seater Triple Sharing</span>
                    <strong className="text-white font-mono">PKR 17,000/mo</strong>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">4-Seater Quad Suite</span>
                    <strong className="text-white font-mono">PKR 14,000/mo</strong>
                  </div>
                </div>

                {/* Instant Reserve Action */}
                <div className="pt-1 space-y-2">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Reserve Seat With CNIC Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam-o-Alaikum, I am applying for admission at ' + config.name + '. Please share hostel brochure and room seat status.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inquire via Official WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DESIGN 5: ROOM SEAT SHOWCASE HERO (LIVE SEATS OPEN / CLOSED STATUS)
         ========================================================================= */}
      {heroLayout === 'split_rooms' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 lg:pt-14 lg:pb-28 relative z-10 space-y-10 animate-in fade-in duration-300">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Seat Availability & Room Inventory</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Comfortable, Clean & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Affordable</span> Hostel Living
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Safe rooms, reliable facilities, Wi-Fi, electricity, clean water, food and professional hostel management.
            </p>

            {/* Quick 3 Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book a Room</span>
              </button>

              <button
                onClick={onViewRooms}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Building className="w-4 h-4 text-emerald-400" />
                <span>View All Rooms</span>
              </button>

              <button
                onClick={onContactHostel}
                className="px-5 py-3.5 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Contact Hostel</span>
              </button>
            </div>
          </div>

          {/* Interactive Room Cards Grid with Live "Seats Open / Closed" Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rooms.slice(0, 4).map((r) => {
              const freeBeds = Math.max(0, r.totalBeds - r.occupiedBeds);
              const isClosed = !!r.seatsClosed;
              const isFull = r.status === 'Occupied' || freeBeds === 0;
              const canBook = !isClosed && !isFull && r.status === 'Available';

              return (
                <div
                  key={r.id}
                  className="rounded-3xl bg-slate-900/95 border border-white/15 overflow-hidden flex flex-col justify-between shadow-xl hover:border-emerald-400/50 transition group"
                >
                  {/* Photo with status badge */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-slate-800">
                    <img
                      src={r.images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                      alt={`Room ${r.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                    {/* Room tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold border border-white/15">
                      Room {r.roomNumber}
                    </div>

                    {/* Seat status badge */}
                    <div className="absolute top-3 right-3">
                      {isClosed ? (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-black shadow-md">
                          🚫 Seats Closed
                        </span>
                      ) : isFull ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-black shadow-md">
                          ⚠️ Fully Occupied
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black shadow-md">
                          ✓ {freeBeds} Bed{freeBeds !== 1 ? 's' : ''} Open
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-2.5 left-3 text-white">
                      <span className="text-[11px] text-emerald-300 font-semibold uppercase">
                        {r.floor} • Capacity {r.capacity}
                      </span>
                      <h4 className="text-base font-extrabold capitalize">{r.roomType.replace('-', ' ')}</h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">Monthly Rent:</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          PKR {r.monthlyRent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>Security Deposit:</span>
                        <span>PKR {r.securityDeposit.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-2">
                      {canBook ? (
                        <button
                          onClick={onOpenBooking}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CalendarCheck className="w-4 h-4" />
                          <span>Book This Room</span>
                        </button>
                      ) : (
                        <button
                          onClick={onContactHostel}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>{isClosed ? 'Seats Closed - Waitlist' : 'Full - Inquire'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
