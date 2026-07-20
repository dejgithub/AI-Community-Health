'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Phone, Navigation, Tag } from 'lucide-react';
import type { Facility } from './map-view';

interface FacilityCardProps {
  facility: Facility;
  index?: number;
}

export default function FacilityCard({ facility, index = 0 }: FacilityCardProps) {
  const typeColors: Record<string, string> = {
    hospital: 'bg-blue-100 text-blue-700 border-blue-200',
    pharmacy: 'bg-green-100 text-green-700 border-green-200',
    clinic: 'bg-amber-100 text-amber-700 border-amber-200',
    blood_bank: 'bg-red-100 text-red-700 border-red-200',
  };

  const typeLabels: Record<string, string> = {
    hospital: 'Hospital',
    pharmacy: 'Pharmacy',
    clinic: 'Clinic',
    blood_bank: 'Blood Bank',
  };

  function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative w-3.5 h-3.5">
            <Star className="absolute w-3.5 h-3.5 text-gray-300" />
            <div className="absolute overflow-hidden w-[50%] h-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-gray-300" />);
      }
    }
    return stars;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{facility.name}</h3>
            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${typeColors[facility.type]}`}>
              {typeLabels[facility.type]}
            </span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            {renderStars(facility.rating)}
            <span className="text-sm font-medium text-gray-700 ml-1">{facility.rating}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
          <span className="flex-1">{facility.address}</span>
          <span className="shrink-0 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {facility.distance}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 shrink-0 text-gray-400" />
          <span className={`font-medium ${facility.isOpen ? 'text-green-600' : 'text-red-500'}`}>
            {facility.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-600">{facility.hours}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 shrink-0 text-gray-400" />
          <a href={`tel:${facility.phone}`} className="text-blue-600 hover:underline font-medium">
            {facility.phone}
          </a>
        </div>

        {facility.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {facility.specialties.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                <Tag className="w-3 h-3" />
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </a>
        <a
          href={`tel:${facility.phone}`}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
      </div>
    </motion.div>
  );
}
