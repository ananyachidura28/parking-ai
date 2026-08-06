import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Building2, 
  Stethoscope, 
  Zap, 
  ShieldCheck, 
  Bot, 
  CheckCircle2, 
  Navigation,
  MapPin
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import AIChatBot from '../components/AIChatBot';
import API from '../services/api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    API.get('/locations')
      .then((res) => {
        if (res.data.success) {
          setLocations(res.data.locations);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-16 pb-20 pt-10 px-6 max-w-7xl mx-auto">
      
      {/* HERO SECTION MATCHING SCREENSHOT */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        
        {/* Neon Top Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>Next-Gen Enterprise Smart Parking OS</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white"
        >
          Park Smarter with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            AI Precision & ANPR Automation
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Eliminate traffic congestion and parking frustration at malls, airports, hospitals, stadiums, and IT parks with real-time slot tracking and seamless ANPR fast passes.
        </motion.p>

        {/* Action Buttons Matching Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            to="/search"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Find & Reserve Parking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/anpr"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-all flex items-center justify-center space-x-2"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Try ANPR Simulator</span>
          </Link>
        </motion.div>

      </section>

      {/* MAP SECTION MATCHING SCREENSHOT */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <InteractiveMap locations={locations} />

        {/* Floating AI Assistant Pill Matching Screenshot Bottom Right */}
        <div className="absolute bottom-6 right-6 z-30">
          <button
            onClick={() => navigate('/search')}
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-2xl shadow-emerald-500/40 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>ParkSmart AI Assistant</span>
          </button>
        </div>
      </section>

      {/* FEATURE Showcase Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Shopping Malls</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-level basement slot maps for Phoenix Marketcity & Select CITYWALK with 15-minute hold timers.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Healthcare & OPD</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Priority OPD & emergency slot allocation at Apollo Hospital and Fortis Healthcare with step-free wheelchair bays.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">150kW EV Supercharging</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reserve ultra-fast EV chargers with live kWh metrics and automated wallet billing.
          </p>
        </div>
      </section>

      {/* Chatbot Overlay */}
      <AIChatBot />

    </div>
  );
}
