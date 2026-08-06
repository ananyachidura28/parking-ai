import { create } from 'zustand';

export const useParkingStore = create((set) => ({
  categoryFilter: 'ALL', // ALL, MALL, HOSPITAL, AIRPORT, IT_PARK
  searchQuery: '',
  hasEVOnly: false,
  selectedLocation: null,
  selectedSlot: null,
  activeFloorIndex: 0,
  activeReservationTimer: null,

  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setHasEVOnly: (val) => set({ hasEVOnly: val }),
  setSelectedLocation: (loc) => set({ selectedLocation: loc, selectedSlot: null }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setActiveFloorIndex: (idx) => set({ activeFloorIndex: idx }),
  setActiveReservationTimer: (timer) => set({ activeReservationTimer: timer }),
}));
