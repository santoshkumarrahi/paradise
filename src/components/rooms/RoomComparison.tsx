import React from 'react';
import { Check, CalendarCheck, HelpCircle } from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { RoomType } from '../../types';

interface RoomComparisonProps {
  onSelectRoomForBooking: (roomType: RoomType) => void;
}

export const RoomComparison: React.FC<RoomComparisonProps> = ({ onSelectRoomForBooking }) => {
  const { rooms } = useHostel();

  // Find lowest price and deposit for each room type
  const getRoomStats = (type: RoomType) => {
    const matching = rooms.filter((r) => r.roomType === type);
    if (!matching.length) {
      return { price: 20000, deposit: 10000, available: false };
    }
    const lowestPrice = Math.min(...matching.map((r) => r.monthlyRent));
    const lowestDeposit = Math.min(...matching.map((r) => r.securityDeposit));
    const hasAvailable = matching.some((r) => r.status === 'Available' && r.occupiedBeds < r.totalBeds);
    return { price: lowestPrice, deposit: lowestDeposit, available: hasAvailable };
  };

  const types: { type: RoomType; label: string; capacity: number }[] = [
    { type: '1-seater', label: '1-Seater Room', capacity: 1 },
    { type: '2-seater', label: '2-Seater Room', capacity: 2 },
    { type: '3-seater', label: '3-Seater Room', capacity: 3 },
    { type: '4-seater', label: '4-Seater Room', capacity: 4 },
  ];

  const features = [
    { name: 'Capacity', render: (t: typeof types[0]) => `${t.capacity} Person` },
    {
      name: 'Monthly Rent',
      render: (t: typeof types[0]) => (
        <span className="font-extrabold text-slate-900">
          PKR {getRoomStats(t.type).price.toLocaleString()}<span className="text-xs font-normal text-slate-500">/mo</span>
        </span>
      ),
    },
    {
      name: 'Security Deposit',
      render: (t: typeof types[0]) => (
        <span className="font-semibold text-slate-700">
          PKR {getRoomStats(t.type).deposit.toLocaleString()}
        </span>
      ),
    },
    {
      name: 'Wi-Fi (100 Mbps)',
      render: () => (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
          <Check className="w-4 h-4 text-emerald-600" /> Yes (Free)
        </span>
      ),
    },
    {
      name: '24-Hour Electricity & Solar',
      render: () => (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
          <Check className="w-4 h-4 text-emerald-600" /> Yes (24/7)
        </span>
      ),
    },
    {
      name: 'Daily Room & Bath Cleaning',
      render: () => (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
          <Check className="w-4 h-4 text-emerald-600" /> Yes (Daily)
        </span>
      ),
    },
    {
      name: 'Clean Drinking Water (RO)',
      render: () => (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
          <Check className="w-4 h-4 text-emerald-600" /> Yes (7-Stage RO)
        </span>
      ),
    },
    {
      name: 'Food & Mess Service',
      render: () => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-medium text-xs">
          Optional (Separate)
        </span>
      ),
    },
    {
      name: 'Attached Washroom',
      render: () => (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
          <Check className="w-4 h-4 text-emerald-600" /> Yes
        </span>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-3 py-1 rounded-full">
            Transparent Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Compare Room Categories & Packages
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Side-by-side breakdown of rent, capacity, security deposits, and standard inclusions across all room types.
          </p>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-4 sm:p-5 font-bold text-sm">Feature</th>
                {types.map((t) => (
                  <th key={t.type} className="p-4 sm:p-5 font-bold text-sm text-center">
                    <div>{t.label}</div>
                    <div className="text-[11px] font-normal text-emerald-400 mt-0.5">
                      {t.capacity} Person{t.capacity > 1 ? 's' : ''}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {features.map((feat, idx) => (
                <tr key={feat.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">{feat.name}</td>
                  {types.map((t) => (
                    <td key={t.type} className="p-4 sm:p-5 text-center">
                      {feat.render(t)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Action Row */}
              <tr className="bg-slate-100/80">
                <td className="p-4 sm:p-5 font-bold text-slate-900">Reserve Online</td>
                {types.map((t) => {
                  const stats = getRoomStats(t.type);
                  return (
                    <td key={t.type} className="p-4 sm:p-5 text-center">
                      <button
                        onClick={() => onSelectRoomForBooking(t.type)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Book {t.label.split(' ')[0]}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
