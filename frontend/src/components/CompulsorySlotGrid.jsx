import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Accessibility, Crown, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

export default function CompulsorySlotGrid({ 
  floors = [], 
  activeFloorIndex = 0, 
  setActiveFloorIndex,
  selectedSlot, 
  onSelectSlot,
  aiRecommendedSlotId
}) {
  const currentFloor = floors[activeFloorIndex] || floors[0];
  const slots = currentFloor?.slots || [];

  return (
    <div className="space-y-6">
      
      {/* Floor Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {floors.map((floor, idx) => (
          <button
            key={floor.id}
            onClick={() => setActiveFloorIndex(idx)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 border ${
              activeFloorIndex === idx
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            <span>{floor.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeFloorIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              Level {floor.level}
            </span>
          </button>
        ))}
      </div>

      {/* Live Status Legend Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-slate-600 dark:text-slate-300">Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shadow-sm shadow-amber-500/50"></span>
            <span className="text-slate-600 dark:text-slate-300">Reserved</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <span className="text-slate-600 dark:text-slate-300">Occupied</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white">
              EV
            </span>
            <span className="text-slate-600 dark:text-slate-300">EV Charger</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-400 flex items-center justify-center text-[9px] font-bold text-slate-900">
              VIP
            </span>
            <span className="text-slate-600 dark:text-slate-300">VIP Bay</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
          <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Click any Available green slot to select</span>
        </div>
      </div>

      {/* Floor Plan Canvas Layout */}
      <div className="glass-card p-6 rounded-3xl relative overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Entrance Gate Indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-500">
            <Navigation className="w-4 h-4" />
            <span>MAIN GATE ENTRY • LANE 1</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500">
            Elevator Distance: 10m - 50m
          </div>
        </div>

        {/* Slot Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isAIRecommended = aiRecommendedSlotId === slot.id;

            let bgColor = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20';
            let statusBadge = 'Available';

            if (slot.status === 'OCCUPIED') {
              bgColor = 'bg-rose-500/10 border-rose-500/30 text-rose-500 opacity-60 cursor-not-allowed';
              statusBadge = 'Occupied';
            } else if (slot.status === 'RESERVED') {
              bgColor = 'bg-amber-500/10 border-amber-500/40 text-amber-500 opacity-80 cursor-not-allowed';
              statusBadge = 'Reserved';
            }

            if (isSelected) {
              bgColor = 'bg-blue-600 text-white border-blue-500 ring-4 ring-blue-500/30 scale-105 shadow-xl';
            }

            return (
              <motion.button
                key={slot.id}
                whileHover={{ scale: slot.status === 'AVAILABLE' ? 1.03 : 1 }}
                whileTap={{ scale: slot.status === 'AVAILABLE' ? 0.97 : 1 }}
                onClick={() => {
                  if (slot.status === 'AVAILABLE') {
                    onSelectSlot(slot);
                  }
                }}
                disabled={slot.status !== 'AVAILABLE'}
                className={`p-3 rounded-2xl border transition-all text-left relative flex flex-col justify-between h-28 ${bgColor}`}
              >
                {/* AI Tag */}
                {isAIRecommended && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[9px] font-black shadow-md flex items-center space-x-0.5">
                    <span>AI TOP PICK</span>
                  </div>
                )}

                {/* Top Info */}
                <div className="flex items-center justify-between w-full">
                  <span className="font-extrabold text-sm tracking-tight">{slot.slotNumber}</span>
                  {slot.isEVCharger && (
                    <span className="p-1 rounded-md bg-blue-500 text-white" title={`${slot.chargerKw || 150}kW Fast Charger`}>
                      <Zap className="w-3 h-3 fill-white" />
                    </span>
                  )}
                  {slot.type === 'ACCESSIBLE' && (
                    <span className="p-1 rounded-md bg-emerald-600 text-white">
                      <Accessibility className="w-3 h-3" />
                    </span>
                  )}
                  {slot.type === 'VIP' && (
                    <span className="p-1 rounded-md bg-amber-400 text-slate-900">
                      <Crown className="w-3 h-3 fill-slate-900" />
                    </span>
                  )}
                </div>

                {/* Zone Info */}
                <div className="text-[10px] opacity-80 font-medium truncate">
                  {slot.zone || 'Zone A'}
                </div>

                {/* Bottom Price & Status */}
                <div className="flex items-center justify-between text-[11px] font-bold border-t border-current/10 pt-1.5">
                  <span>₹{slot.hourlyPrice}/hr</span>
                  <span className="text-[10px] tracking-wide uppercase">{statusBadge}</span>
                </div>

                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 text-white">
                    <CheckCircle2 className="w-4 h-4 fill-white text-blue-600" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
