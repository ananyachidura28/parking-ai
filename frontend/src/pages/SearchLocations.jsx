import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Stethoscope, 
  Search, 
  Zap, 
  MapPin, 
  Star, 
  ChevronRight, 
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { useParkingStore } from '../store/useParkingStore';
import API from '../services/api';

const FALLBACK_IMAGES = {
  MALL: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80',
  HOSPITAL: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80',
  IT_PARK: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80'
};

const DEFAULT_MOCK_LOCATIONS = [
  {
    id: 'phoenix-marketcity-mall-id',
    name: 'Phoenix Marketcity Mega Mall',
    slug: 'phoenix-marketcity-mall',
    category: 'MALL',
    address: 'Whitefield Main Road, Mahadevapura',
    city: 'Bengaluru',
    state: 'Karnataka',
    totalSlots: 120,
    hourlyRate: 60,
    availableSlotsCount: 14,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80',
    description: 'Premier shopping hub featuring 4 sub-basement parking levels, ultra-fast 150kW EV charging, automated valet tag drop.'
  },
  {
    id: 'apollo-hospital-id',
    name: 'Apollo Super Speciality Hospital',
    slug: 'apollo-super-speciality-hospital',
    category: 'HOSPITAL',
    address: '154/11 Bannerghatta Road, Opposite IIM',
    city: 'Bengaluru',
    state: 'Karnataka',
    totalSlots: 90,
    hourlyRate: 40,
    availableSlotsCount: 14,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80',
    description: 'Dedicated healthcare parking with priority emergency entrance access and step-free wheelchair bays.'
  },
  {
    id: 'select-citywalk-id',
    name: 'Select CITYWALK Mall',
    slug: 'select-citywalk-mall',
    category: 'MALL',
    address: 'A-3, District Centre, Saket',
    city: 'New Delhi',
    state: 'Delhi',
    totalSlots: 100,
    hourlyRate: 70,
    availableSlotsCount: 18,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80',
    description: 'Luxury shopping center featuring Tesla Superchargers and priority VIP valet lounges.'
  },
  {
    id: 'fortis-hospital-id',
    name: 'Fortis Memorial Research Institute',
    slug: 'fortis-memorial-research-institute',
    category: 'HOSPITAL',
    address: 'Sector 44, Opposite HUDA City Centre',
    city: 'Gurugram',
    state: 'Haryana',
    totalSlots: 80,
    hourlyRate: 45,
    availableSlotsCount: 12,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    description: 'State-of-the-art medical center parking with express patient drop-off.'
  },
  {
    id: 'dlf-cyber-hub-id',
    name: 'DLF Cyber Hub Tech Park',
    slug: 'dlf-cyber-hub-it-park',
    category: 'IT_PARK',
    address: 'DLF Cyber City, Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    totalSlots: 150,
    hourlyRate: 50,
    availableSlotsCount: 22,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    description: 'Modern corporate hub parking equipped with smart License Plate Recognition (ANPR).'
  }
];

export default function SearchLocations() {
  const navigate = useNavigate();
  const { categoryFilter, setCategoryFilter, searchQuery, setSearchQuery, hasEVOnly, setHasEVOnly } = useParkingStore();
  const [locations, setLocations] = useState(DEFAULT_MOCK_LOCATIONS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const params = {};
    if (categoryFilter !== 'ALL') params.category = categoryFilter;
    if (searchQuery) params.search = searchQuery;
    if (hasEVOnly) params.hasEV = 'true';

    API.get('/locations', { params })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.locations) && res.data.locations.length > 0) {
          setLocations(res.data.locations);
        } else {
          // Filter fallback mock locations
          let filtered = DEFAULT_MOCK_LOCATIONS;
          if (categoryFilter !== 'ALL') {
            filtered = filtered.filter((l) => l.category === categoryFilter);
          }
          if (searchQuery) {
            filtered = filtered.filter((l) =>
              l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              l.city.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          if (hasEVOnly) {
            filtered = filtered.filter((l) => l.hasEVCharging);
          }
          setLocations(filtered);
        }
        setIsLoading(false);
      })
      .catch(() => {
        let filtered = DEFAULT_MOCK_LOCATIONS;
        if (categoryFilter !== 'ALL') {
          filtered = filtered.filter((l) => l.category === categoryFilter);
        }
        if (searchQuery) {
          filtered = filtered.filter((l) =>
            l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.city.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (hasEVOnly) {
          filtered = filtered.filter((l) => l.hasEVCharging);
        }
        setLocations(filtered);
        setIsLoading(false);
      });
  }, [categoryFilter, searchQuery, hasEVOnly]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header & Filter Controls */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Find & Reserve Smart Parking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse real-time available slots at premier Malls, Hospitals, IT Parks, and Smart Transit Hubs.
          </p>
        </div>

        {/* Search Bar & Toggles */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'All Destinations', icon: MapPin },
              { id: 'MALL', label: 'Shopping Malls', icon: Building2 },
              { id: 'HOSPITAL', label: 'Hospitals & Healthcare', icon: Stethoscope },
              { id: 'IT_PARK', label: 'IT & Corporate Hubs', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-blue-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box & EV Checkbox */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Phoenix, Apollo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasEVOnly}
                onChange={(e) => setHasEVOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                <span>EV Hubs</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-3xl animate-pulse bg-slate-900/60 border border-slate-800"></div>
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <MapPin className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Parking Locations Found</h3>
          <p className="text-xs text-slate-400">Try loosening your search filters or selecting another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => {
            const fallbackSrc = FALLBACK_IMAGES[loc.category] || FALLBACK_IMAGES.DEFAULT;

            return (
              <div
                key={loc.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between group shadow-xl"
              >
                {/* Card Image with Image Fallback Handler */}
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={loc.imageUrl || fallbackSrc}
                    alt={loc.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackSrc;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1 border border-slate-800">
                    {loc.category === 'HOSPITAL' ? (
                      <Stethoscope className="w-3 h-3 text-rose-400" />
                    ) : (
                      <Building2 className="w-3 h-3 text-blue-400" />
                    )}
                    <span>{loc.category}</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>{loc.rating || 4.9}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-white leading-tight">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {loc.address}, {loc.city}
                    </p>
                  </div>

                  {/* Slots & Facilities Pills */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {loc.availableSlotsCount ?? 14} Slots Free
                    </span>
                    {loc.hasEVCharging && (
                      <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 flex items-center space-x-1">
                        <Zap className="w-3 h-3 fill-blue-500" />
                        <span>EV Hub</span>
                      </span>
                    )}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Hourly Rate</span>
                      <span className="text-base font-black text-white">₹{loc.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></span>
                    </div>

                    <button
                      onClick={() => navigate(`/book/${loc.slug}`)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 hover:scale-105"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Select & Book Slot</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
