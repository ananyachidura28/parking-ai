import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Zap, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useParkingStore } from '../store/useParkingStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setRole } = useAuthStore();
  const { searchQuery, setSearchQuery } = useParkingStore();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search');
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search malls, airports, EV chargers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
        />
      </form>

      {/* Top Right Action Bar */}
      <div className="flex items-center space-x-3">
        
        {/* EV Supercharger Pill */}
        <Link
          to="/ev-charging"
          className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all"
        >
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>EV Supercharger</span>
        </Link>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:border-slate-700"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{user?.role?.replace('_', ' ') || 'CUSTOMER'}</span>
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 py-2 z-50">
              {['CUSTOMER', 'PARKING_OPERATOR', 'MALL_OWNER', 'VALET_STAFF', 'ADMINISTRATOR'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-800 flex items-center justify-between ${
                    user?.role === r ? 'text-emerald-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>{r.replace('_', ' ')}</span>
                  {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1"></span>
        </button>

        {/* Sign In Link */}
        <Link to="/dashboard" className="text-xs font-semibold text-slate-300 hover:text-white px-2">
          Sign In
        </Link>

        {/* Get Started Emerald Button */}
        <Link
          to="/search"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
        >
          Get Started
        </Link>
      </div>

    </header>
  );
}
