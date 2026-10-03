import React from 'react';
import {
  Zap,
  Wifi,
  Droplets,
  Snowflake,
  Sparkles,
  Shirt,
  Utensils,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Flame,
  Car,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

interface QuickFacilitiesProps {
  onViewAllFacilities: () => void;
}

export const QuickFacilities: React.FC<QuickFacilitiesProps> = ({ onViewAllFacilities }) => {
  const { facilities, config } = useHostel();

  // Helper to map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-sky-500" />;
      case 'droplets':
        return <Droplets className="w-5 h-5 text-teal-500" />;
      case 'snowflake':
        return <Snowflake className="w-5 h-5 text-cyan-500" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'shirt':
        return <Shirt className="w-5 h-5 text-blue-500" />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case 'shieldcheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'alerttriangle':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'car':
        return <Car className="w-5 h-5 text-slate-600" />;
      case 'bookopen':
        return <BookOpen className="w-5 h-5 text-violet-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
    }
  };

  // Filter ONLY available and enabled facilities by admin (Rule from section 5 & 10)
  const enabledFacilities = facilities.filter((f) => f.isEnabled);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-3 py-1 rounded-full">
              Standard Hostel Amenities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Everything You Need for Peaceful Living
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Transparent, verified amenities available on site. All facilities are strictly regulated and maintained by our management.
            </p>
          </div>

          <button
            onClick={onViewAllFacilities}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition self-start md:self-end"
          >
            <span>View All Detailed Facilities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Quick Facility Cards (Exact Section 5 requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Location */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-200 transition group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Prime Location</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {config.area}, {config.city}. Close to metro stations, colleges and commercial markets.
            </p>
            <span className="inline-block mt-3 text-[11px] font-semibold text-emerald-700">
              Verified Location
            </span>
          </div>

          {/* Render admin enabled facilities */}
          {enabledFacilities.slice(0, 9).map((facility) => (
            <div
              key={facility.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-200 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center mb-3 transition">
                {getIcon(facility.icon)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{facility.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{facility.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    facility.isFree
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {facility.isFree ? 'Included Free' : (facility.priceNote || 'Optional Paid')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
