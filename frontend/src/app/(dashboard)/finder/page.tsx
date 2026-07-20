'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, List, Locate, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import FacilityCard from '@/components/finder/facility-card';
import type { Facility } from '@/components/finder/map-view';
import { api, type HospitalRead, type PharmacyRead } from '@/lib/api-client';

const MapView = dynamic(() => import('@/components/finder/map-view'), { ssr: false });

function mapHospital(h: HospitalRead): Facility {
  const hoursStr = h.opening_hours
    ? Object.entries(h.opening_hours)
        .map(([day, hours]) => `${day}: ${hours}`)
        .join(', ')
    : '24/7';
  return {
    id: `hospital-${h.id}`,
    name: h.name,
    type: 'hospital',
    lat: h.latitude,
    lng: h.longitude,
    address: h.address,
    rating: h.rating,
    distance: '',
    phone: h.phone ?? '',
    hours: hoursStr,
    isOpen: h.is_open,
    specialties: h.specialties ?? [],
  };
}

function mapPharmacy(p: PharmacyRead): Facility {
  const hoursStr = p.opening_hours
    ? Object.entries(p.opening_hours)
        .map(([day, hours]) => `${day}: ${hours}`)
        .join(', ')
    : '';
  return {
    id: `pharmacy-${p.id}`,
    name: p.name,
    type: 'pharmacy',
    lat: p.latitude,
    lng: p.longitude,
    address: p.address,
    rating: p.rating,
    distance: '',
    phone: p.phone ?? '',
    hours: hoursStr,
    isOpen: p.is_open,
    specialties: [],
  };
}

const filterTabs = ['All', 'Hospitals', 'Pharmacies', 'Clinics', 'Blood Banks'] as const;
type FilterTab = (typeof filterTabs)[number];

const specialties = [
  'All Specialties',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'General Practice',
  'Emergency',
  'Vaccination',
  'Blood Services',
];

const typeFilterMap: Record<FilterTab, Facility['type'] | null> = {
  All: null,
  Hospitals: 'hospital',
  Pharmacies: 'pharmacy',
  Clinics: 'clinic',
  'Blood Banks': 'blood_bank',
};

export default function FinderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showMobileList, setShowMobileList] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchFacilities() {
      setLoading(true);
      try {
        const [hospitals, pharmacies] = await Promise.all([
          api.health.hospitals(),
          api.health.pharmacies(),
        ]);
        if (!cancelled) {
          setFacilities([
            ...hospitals.map(mapHospital),
            ...pharmacies.map(mapPharmacy),
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch facilities', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchFacilities();
    return () => { cancelled = true; };
  }, []);

  const filteredFacilities = useMemo(() => {
    let result = [...facilities];

    if (activeTab !== 'All') {
      const type = typeFilterMap[activeTab];
      if (type) result = result.filter((f) => f.type === type);
    }

    if (selectedSpecialty !== 'All Specialties') {
      result = result.filter((f) => f.specialties.includes(selectedSpecialty));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

    return result;
  }, [facilities, activeTab, selectedSpecialty, searchQuery, sortBy]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, pharmacies, clinics..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Map className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Specialty + Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:max-w-[200px]">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
                className="appearance-none px-3 py-2 pr-8 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="distance">Nearest First</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Loading facilities...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop: Side-by-side */}
            <div className="hidden md:flex h-full">
              {(viewMode === 'map' || viewMode === 'list') && (
                <>
                  {viewMode === 'map' && (
                    <div className="flex-1 relative">
                      <MapView facilities={filteredFacilities} />
                      <button
                        onClick={() => {
                          /* geolocation */
                        }}
                        className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <Locate className="w-5 h-5 text-blue-600" />
                      </button>
                    </div>
                  )}
                  <div className={`${viewMode === 'map' ? 'w-[400px]' : 'flex-1'} border-l border-gray-200 bg-white overflow-y-auto`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700">
                          {filteredFacilities.length} facilities found
                        </h2>
                        <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className={`space-y-3 ${viewMode === 'list' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 space-y-0' : ''}`}>
                        {filteredFacilities.map((f, i) => (
                          <FacilityCard key={f.id} facility={f} index={i} />
                        ))}
                      </div>
                      {filteredFacilities.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-sm">No facilities found matching your criteria.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile: Map with bottom sheet */}
            <div className="md:hidden h-full relative">
              <div className="h-full">
                <MapView facilities={filteredFacilities} />
                <button
                  onClick={() => {}}
                  className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg"
                >
                  <Locate className="w-5 h-5 text-blue-600" />
                </button>
              </div>

              {/* Bottom Sheet Toggle */}
              <button
                onClick={() => setShowMobileList(!showMobileList)}
                className="absolute bottom-4 left-4 z-[1000] bg-blue-600 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                {filteredFacilities.length} facilities
              </button>

              {/* Bottom Sheet */}
              <AnimatePresence>
                {showMobileList && (
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="absolute bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-2xl max-h-[60vh] overflow-y-auto shadow-2xl"
                  >
                    <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b border-gray-100">
                      <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">
                          {filteredFacilities.length} facilities nearby
                        </h2>
                        <button onClick={() => setShowMobileList(false)}>
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {filteredFacilities.map((f, i) => (
                        <FacilityCard key={f.id} facility={f} index={i} />
                      ))}
                      {filteredFacilities.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 text-sm">No facilities found.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
