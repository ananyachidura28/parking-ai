import React from 'react';
import { Car, Building2, Stethoscope, ShieldCheck, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">ParkSmart <span className="text-blue-500">AI</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enterprise-grade Smart Parking Management Platform powering Malls, Hospitals, Airports, IT Parks, and Smart Cities with real-time AI slot booking and indoor navigation.
          </p>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WCAG 2.1 Compliant • 99.99% Uptime</span>
          </div>
        </div>

        {/* Column 2: Key Destinations */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Partner Networks</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phoenix Marketcity Mega Mall</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
              <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
              <span>Apollo Super Speciality Hospital</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select CITYWALK Saket</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
              <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
              <span>Fortis Healthcare Block</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>DLF Cyber Hub IT Park</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform Features */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core Modules</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/search" className="hover:text-white transition-colors">Compulsory Slot Booking</Link></li>
            <li><Link to="/anpr" className="hover:text-white transition-colors">ANPR Automatic Barrier Simulation</Link></li>
            <li><Link to="/indoor-nav" className="hover:text-white transition-colors">Indoor Navigation & Find Vehicle</Link></li>
            <li><Link to="/valet" className="hover:text-white transition-colors">Valet Request & Key Tag System</Link></li>
            <li><Link to="/marketplace" className="hover:text-white transition-colors">Private Parking Marketplace</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Analytics & AI Demand Prediction</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Support */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Enterprise Support</h4>
          <p className="text-xs text-slate-400 mb-3">
            Subscribe for platform operational updates and new EV hub launches.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Enter corporate email"
              className="bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-l-xl focus:outline-none w-full text-white"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-r-xl transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 ParkSmart AI Inc. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for Next-Gen Smart Mobility</span>
        </p>
      </div>
    </footer>
  );
}
