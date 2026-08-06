import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Layers, ArrowUpRight, Compass } from 'lucide-react';

export default function IndoorPathMap({ slotNumber = 'B1-03', floorName = 'Basement Level 1' }) {
  return (
    <div className="glass-card p-6 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Indoor Navigation & Pathfinding</h3>
            <p className="text-xs text-slate-500">{floorName} • Route to Slot {slotNumber}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
          35 Meters • 1 Min Walk
        </span>
      </div>

      {/* SVG Canvas Map Path Visualizer */}
      <div className="relative h-64 bg-slate-900 rounded-2xl overflow-hidden p-4 border border-slate-800 flex items-center justify-center">
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <svg className="w-full h-full relative z-10" viewBox="0 0 600 300">
          {/* Lanes & Corridors */}
          <rect x="40" y="40" width="520" height="220" fill="none" stroke="#334155" strokeWidth="2" rx="12" />
          <line x1="200" y1="40" x2="200" y2="260" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="400" y1="40" x2="400" y2="260" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

          {/* Zones */}
          <text x="80" y="70" fill="#64748b" fontSize="12" fontWeight="bold">ZONE A (ENTRANCE)</text>
          <text x="240" y="70" fill="#64748b" fontSize="12" fontWeight="bold">ZONE B (ELEVATORS)</text>
          <text x="440" y="70" fill="#64748b" fontSize="12" fontWeight="bold">ZONE C (EV BAYS)</text>

          {/* Elevator Symbol */}
          <circle cx="280" cy="150" r="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="274" y="154" fill="#3b82f6" fontSize="11" fontWeight="bold">🛗</text>

          {/* Parked Vehicle Slot Box */}
          <rect x="460" y="180" width="70" height="45" fill="#10b98122" stroke="#10b981" strokeWidth="2" rx="8" />
          <text x="475" y="207" fill="#10b981" fontSize="13" fontWeight="bold">{slotNumber}</text>

          {/* Animated Route Path */}
          <motion.path
            d="M 80 200 L 280 200 L 280 150 L 495 150 L 495 180"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeDasharray="8 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />

          {/* Current Location Pulsing Pin */}
          <g transform="translate(80, 200)">
            <circle r="12" fill="#3b82f6" opacity="0.4" className="animate-ping" />
            <circle r="8" fill="#3b82f6" />
            <text x="-25" y="25" fill="#93c5fd" fontSize="10" fontWeight="bold">YOU ARE HERE</text>
          </g>

          {/* Destination Vehicle Marker */}
          <g transform="translate(495, 180)">
            <circle r="6" fill="#10b981" />
          </g>
        </svg>
      </div>

      {/* Step-by-Step Directions */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step-by-Step Guidance</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-blue-500">Step 1</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Enter Main Entrance</p>
            <p className="text-[11px] text-slate-500">Drive through ANPR scanner barrier lane 1.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-500">Step 2</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Turn Right at Elevator</p>
            <p className="text-[11px] text-slate-500">Follow blue floor LEDs towards Zone C.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-emerald-500">Step 3</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Park in Slot {slotNumber}</p>
            <p className="text-[11px] text-slate-500">Plug EV charger if required. Lock vehicle.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
