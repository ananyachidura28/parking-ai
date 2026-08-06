import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Navigation, 
  Zap, 
  Camera, 
  Car, 
  PhoneCall, 
  Store, 
  TrendingUp, 
  Wrench, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Smart Search & Map', path: '/search', icon: Search },
    { label: 'Indoor Navigation', path: '/indoor-nav', icon: Navigation },
    { label: 'EV Supercharging', path: '/ev-charging', icon: Zap, badge: '50kW', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { label: 'ANPR Camera Scanner', path: '/anpr', icon: Camera, badge: 'Live', badgeColor: 'bg-emerald-500 text-slate-950 font-black' },
    { label: 'Find My Vehicle', path: '/find-vehicle', icon: Car },
    { label: 'Valet Service', path: '/valet', icon: PhoneCall },
    { label: 'Marketplace (Rent)', path: '/marketplace', icon: Store },
    { label: 'Analytics & AI Insights', path: '/admin', icon: TrendingUp },
    { label: 'Car Wash & Service', path: '/services', icon: Wrench },
    { label: 'Admin Command', path: '/admin', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-[#0b0f19] border-r border-slate-800/80 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen select-none overflow-y-auto scrollbar-none z-40">
      
      <div className="space-y-6">
        {/* Brand Header */}
        <NavLink to="/" className="flex items-center space-x-3 px-2 pt-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xl font-black text-white tracking-tight">ParkSmart</span>
              <span className="text-xl font-black text-emerald-400">AI</span>
            </div>
            <div className="flex items-center space-x-1.5 -mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                REAL-TIME OS
              </span>
            </div>
          </div>
        </NavLink>

        {/* Section Label */}
        <div className="px-3 pt-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            NAVIGATION CONTROL
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Assistant Teaser Pill */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2 mt-6">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Smart AI Assistant</span>
        </div>
        <p className="text-[11px] text-slate-400">Live slot occupancy & ANPR barrier automation running on v2.4 OS.</p>
      </div>

    </aside>
  );
}
