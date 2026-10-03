import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn, Eye } from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { GalleryItem } from '../../types';

export const GalleryPage: React.FC = () => {
  const { gallery } = useHostel();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Exterior',
    'Rooms',
    'Washrooms',
    'Kitchen',
    'Food',
    'Common Area',
    'Study Area',
    'Facilities',
  ];

  const filtered = selectedCategory === 'All'
    ? gallery
    : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Hostel Visual Tour
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Hostel Gallery & Photo Tour
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Real, authentic photographs of our hostel premises, study rooms, dining facility, washrooms, and rooms.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3]"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

              <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-slate-900/80 px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
                <h3 className="font-bold text-base mt-1.5 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[16/10] max-h-[70vh] bg-black">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 text-white bg-slate-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {activeImage.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-1">{activeImage.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{activeImage.caption}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
