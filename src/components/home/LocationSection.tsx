import React from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

export const LocationSection: React.FC = () => {
  const { config } = useHostel();

  return (
    <section id="location-section" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-3.5 py-1.5 rounded-full">
            Location & Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Hostel Address & Directions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Centrally situated in {config.city}, Pakistan with seamless connectivity to public transit, universities, and commercial shopping centers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                    {config.name}
                  </h3>
                  <p className="text-xs text-slate-500">{config.tagline}</p>
                </div>
              </div>

              {/* Exact fields from Section 7 */}
              <div className="divide-y divide-slate-100 text-xs sm:text-sm pt-2">
                <div className="py-2.5 flex justify-between items-start gap-2">
                  <span className="text-slate-500 font-medium">Complete Address:</span>
                  <span className="font-semibold text-slate-800 text-right">{config.address}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">Area:</span>
                  <span className="font-semibold text-slate-800">{config.area}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">City:</span>
                  <span className="font-semibold text-slate-800">{config.city}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">District:</span>
                  <span className="font-semibold text-slate-800">{config.district}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">Province:</span>
                  <span className="font-semibold text-slate-800">{config.province}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">Country:</span>
                  <span className="font-semibold text-slate-800">{config.country}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <a href={`tel:${config.phone}`} className="font-semibold text-emerald-700 hover:underline">{config.phone}</a>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    {config.whatsapp}
                  </a>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-2">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <a href={`mailto:${config.email}`} className="font-semibold text-slate-800 hover:underline">{config.email}</a>
                </div>
              </div>
            </div>

            {/* 4 Required Action Buttons from Section 7 */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${config.phone}`}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>

              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:${config.email}`}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
              >
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
            <div className="relative w-full h-[400px] lg:h-full min-h-[350px]">
              <iframe
                title="Hostel Google Maps Location"
                src={config.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[350px]"
              ></iframe>

              {/* Float badge */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-200 text-xs">
                <p className="font-bold text-slate-900">{config.name}</p>
                <p className="text-[11px] text-slate-500">{config.area}, {config.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
