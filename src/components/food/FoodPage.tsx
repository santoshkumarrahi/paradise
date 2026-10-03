import React from 'react';
import {
  Utensils,
  Clock,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  Coffee,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

export const FoodPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { food, config } = useHostel();

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-3.5 py-1.5 rounded-full">
            Mess & Dining Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Hygienic Home-Cooked Food
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Fresh, balanced desi and continental meals prepared daily in our spotless kitchen. Food service is an optional, independent package.
          </p>
        </div>

        {/* CRITICAL NOTICE FROM SECTION 16 */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Important Notice regarding Meal Charges:</p>
            <p className="mt-0.5">
              Food charges must be clearly separated from room rent. Residents have full flexibility to opt for our Monthly Mess Package (PKR {food.monthlyPackagePrice.toLocaleString()}/mo), pay on a per-meal basis, or arrange their own dining.
            </p>
          </div>
        </div>

        {/* Pricing & Timings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Breakfast */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Morning Meal</span>
              <h3 className="font-extrabold text-slate-900 text-xl">Breakfast</h3>
              <p className="text-2xl font-black text-slate-900 mt-2">
                PKR {food.breakfastPrice.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> /meal</span>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{food.breakfastTiming}</span>
            </div>
          </div>

          {/* Lunch */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Midday Meal</span>
              <h3 className="font-extrabold text-slate-900 text-xl">Lunch</h3>
              <p className="text-2xl font-black text-slate-900 mt-2">
                PKR {food.lunchPrice.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> /meal</span>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{food.lunchTiming}</span>
            </div>
          </div>

          {/* Dinner */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evening Meal</span>
              <h3 className="font-extrabold text-slate-900 text-xl">Dinner</h3>
              <p className="text-2xl font-black text-slate-900 mt-2">
                PKR {food.dinnerPrice.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> /meal</span>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{food.dinnerTiming}</span>
            </div>
          </div>

          {/* Monthly Package Highlight */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">All-Inclusive Saver</span>
              <h3 className="font-extrabold text-white text-xl">Monthly Food Plan</h3>
              <p className="text-2xl font-black text-white mt-2">
                PKR {food.monthlyPackagePrice.toLocaleString()}
                <span className="text-xs font-normal text-emerald-200"> /month</span>
              </p>
            </div>
            <p className="text-xs text-emerald-100 pt-1 border-t border-white/10">
              Covers 3 hot meals daily, 7 days a week. Fresh Sunday special brunch included.
            </p>
          </div>
        </div>

        {/* Weekly Mess Menu Table */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Weekly Mess Menu</h3>
              <p className="text-xs text-slate-400 mt-0.5">Rotational nutritious diet curated by hostel nutritionist.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halal & Verified Cooking Oils</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 w-32">Day</th>
                  <th className="p-4">Breakfast ({food.breakfastTiming})</th>
                  <th className="p-4">Lunch ({food.lunchTiming})</th>
                  <th className="p-4">Dinner ({food.dinnerTiming})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {food.menu.map((m, idx) => (
                  <tr key={m.day} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-4 font-bold text-slate-900">{m.day}</td>
                    <td className="p-4 text-slate-700">{m.breakfast}</td>
                    <td className="p-4 text-slate-700">{m.lunch}</td>
                    <td className="p-4 text-slate-700 font-medium">{m.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mess Kitchen Hygiene Protocol */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-lg">Kitchen Hygiene & Health Standards</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {food.hygieneStandard}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-700 font-medium">
            <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>RO Purified Cooking Water</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Daily Fresh Butchered Halal Meat</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Stainless Steel Cookware Sanitization</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={onOpenBooking}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-700/20 active:scale-98 transition cursor-pointer"
          >
            Apply for Room & Food Package
          </button>
        </div>
      </div>
    </div>
  );
};
