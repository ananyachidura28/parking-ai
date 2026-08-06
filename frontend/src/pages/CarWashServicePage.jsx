import React, { useState } from 'react';
import { Wrench, Sparkles, CheckCircle2, Car, ShieldCheck } from 'lucide-react';

export default function CarWashServicePage() {
  const [booked, setBooked] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">On-Demand Car Wash & Vehicle Care</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Get your vehicle detailed and serviced while comfortably parked at the mall or hospital.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
            MOST POPULAR
          </span>
          <h3 className="text-xl font-bold text-white">Eco Waterless Foam Wash</h3>
          <p className="text-xs text-slate-400">Exterior high-gloss nano foam wash & tire shine while parked.</p>
          <div className="text-2xl font-black text-emerald-400">₹399</div>
          <button
            onClick={() => setBooked(true)}
            className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
          >
            Book Wash for My Slot
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase">
            FULL INTERIOR
          </span>
          <h3 className="text-xl font-bold text-white">Deep Interior Sanitization</h3>
          <p className="text-xs text-slate-400">Vacuuming, upholstery steam clean, and AC duct ozone treatment.</p>
          <div className="text-2xl font-black text-blue-400">₹699</div>
          <button
            onClick={() => setBooked(true)}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
          >
            Book Interior Clean
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] uppercase">
            EV SPECIAL
          </span>
          <h3 className="text-xl font-bold text-white">EV Diagnostic & Tire Check</h3>
          <p className="text-xs text-slate-400">Battery health check, coolant inspection, and digital nitrogen tire fill.</p>
          <div className="text-2xl font-black text-cyan-400">₹499</div>
          <button
            onClick={() => setBooked(true)}
            className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
          >
            Book EV Checkup
          </button>
        </div>

      </div>

      {booked && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
          ✅ Service requested! Service technician assigned to your parked vehicle slot.
        </div>
      )}
    </div>
  );
}
