import React, { useState } from 'react';
import {
  Users,
  Check,
  ShieldCheck,
  CalendarCheck,
  Bed,
  Bath,
  Wind,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { Room, RoomType } from '../../types';

interface RoomCardsProps {
  onSelectRoomForBooking: (roomType: RoomType, roomNumber?: string) => void;
  showAllTypes?: boolean;
}

export const RoomCards: React.FC<RoomCardsProps> = ({ onSelectRoomForBooking, showAllTypes = true }) => {
  const { rooms, config } = useHostel();
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Filter rooms
  const filteredRooms = selectedTypeFilter === 'all'
    ? rooms
    : rooms.filter((r) => r.roomType === selectedTypeFilter);

  // Group summary for 1-seater, 2-seater, 3-seater, 4-seater
  const roomTypesMeta: { type: RoomType; label: string; capacity: number }[] = [
    { type: '1-seater', label: '1-Seater Room', capacity: 1 },
    { type: '2-seater', label: '2-Seater Room', capacity: 2 },
    { type: '3-seater', label: '3-Seater Room', capacity: 3 },
    { type: '4-seater', label: '4-Seater Room', capacity: 4 },
  ];

  return (
    <section id="rooms-section" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Accommodation & Rates
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Explore Available Hostel Rooms
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            All rooms come furnished with comfortable mattresses, personal wardrobes, study tables, and attached washrooms. Choose between private single suites or shared rooms.
          </p>

          {/* Room Type Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedTypeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Room Categories
            </button>
            {roomTypesMeta.map((t) => (
              <button
                key={t.type}
                onClick={() => setSelectedTypeFilter(t.type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedTypeFilter === t.type
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => {
            const availableBeds = Math.max(0, room.totalBeds - room.occupiedBeds);
            const isSeatsClosed = !!room.seatsClosed;
            const isFullyOccupied = room.status === 'Occupied' || availableBeds === 0;
            const isMaintenance = room.status === 'Maintenance';
            const isBookable = !isSeatsClosed && !isFullyOccupied && !isMaintenance && room.status === 'Available';

            return (
              <div
                key={room.id}
                className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col group"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                  <img
                    src={room.images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'}
                    alt={`Room ${room.roomNumber} - ${room.roomType}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Room Number & Floor Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold border border-white/10">
                    Room {room.roomNumber} • {room.floor}
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-xs shadow-xs ${
                        isSeatsClosed
                          ? 'bg-rose-700 text-white'
                          : isBookable
                          ? 'bg-emerald-600/90 text-white'
                          : isMaintenance
                          ? 'bg-amber-600/90 text-white'
                          : 'bg-red-600/90 text-white'
                      }`}
                    >
                      {isSeatsClosed
                        ? 'Seats Closed'
                        : isBookable
                        ? `${availableBeds} Bed Available`
                        : isMaintenance
                        ? 'Maintenance'
                        : 'Occupied'}
                    </span>
                  </div>

                  {/* Room Type badge bottom left */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                      Capacity: {room.capacity} {room.capacity === 1 ? 'Person' : 'People'}
                    </span>
                    <h3 className="text-base font-extrabold capitalize text-white">
                      {room.roomType.replace('-', ' ')}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Pricing Details (Exact PKR requirement) */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Monthly Rent:</span>
                      <span className="text-lg font-black text-slate-900">
                        PKR {room.monthlyRent.toLocaleString()}
                        <span className="text-xs text-slate-500 font-normal">/mo</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 pt-1">
                      <span>Security Deposit:</span>
                      <span className="font-semibold text-slate-700">
                        PKR {room.securityDeposit.toLocaleString()} (Refundable)
                      </span>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Bed className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{room.totalBeds} Individual Bed{room.totalBeds > 1 ? 's' : ''} ({room.occupiedBeds} occupied)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{room.attachedWashroom ? 'Attached Private Washroom & Geyser' : 'Shared Washroom'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{room.hasAC ? 'Split Inverter AC + Solar Backup' : 'Ceiling Fan & Solar Inverter'}</span>
                    </div>
                  </div>

                  {/* Closed reason notice if closed */}
                  {isSeatsClosed && room.closedReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                      <strong>Admissions Locked:</strong> {room.closedReason}
                    </div>
                  )}

                  {/* Book Now Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectRoomForBooking(room.roomType, room.roomNumber)}
                      disabled={!isBookable}
                      className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                        isBookable
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 active:scale-98'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>
                        {isSeatsClosed
                          ? 'Seats Closed by Admin'
                          : isBookable
                          ? 'Book Now'
                          : isMaintenance
                          ? 'Under Maintenance'
                          : 'Room Occupied'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Pricing & Deposits */}
        <div className="mt-8 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            <strong>Note on Room Rent:</strong> Security deposit is fully refundable at check-out upon 15 days written notice and clearance of hostel dues. Food charges are optional and billed separately (PKR 14,000/month full 3 meals or individual meal options).
          </p>
        </div>
      </div>
    </section>
  );
};
