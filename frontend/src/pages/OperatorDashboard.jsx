import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Car, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Camera, 
  RefreshCw, 
  AlertTriangle, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { socket } from '../services/socket';
import API from '../services/api';

export default function OperatorDashboard() {
  const [stats, setStats] = useState(null);
  const [anprEvents, setAnprEvents] = useState([
    { type: 'ENTRY', plateNumber: 'KA-01-MJ-4092', locationName: 'Phoenix Marketcity Mall', slotNumber: 'B1-03', timestamp: new Date() },
    { type: 'EXIT', plateNumber: 'MH-12-PQ-8819', locationName: 'Apollo Hospital', slotNumber: 'H-OPD-02', timestamp: new Date() },
  ]);

  useEffect(() => {
    API.get('/analytics/dashboard')
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => console.error(err));

    socket.on('anpr_gate_event', (event) => {
      setAnprEvents((prev) => [event, ...prev.slice(0, 9)]);
    });

    return () => {
      socket.off('anpr_gate_event');
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Mall & Hospital Operations Console</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-bold text-[10px] uppercase border border-blue-500/30">
              OPERATOR ROLE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Live Occupancy Monitor & ANPR Gate Telemetry</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live Occupancy Rate</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-blue-500">{stats?.occupancyRate || 68}%</span>
            <span className="text-xs font-bold text-emerald-500">Peak Load</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Active Revenue</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-500">₹{stats?.totalRevenue || 4850}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">EV Active Chargers</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-500">12 / 16</span>
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Reservations</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-indigo-500">{stats?.totalReservations || 42}</span>
          </div>
        </div>
      </div>

      {/* ANPR Real-Time Barrier Stream Log */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-500" />
            <span>ANPR Gate Barrier Live Log Stream</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase">
            Socket.IO Active
          </span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {anprEvents.map((e, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 rounded-xl font-black text-[10px] ${
                  e.type === 'ENTRY' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {e.type}
                </span>
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{e.plateNumber}</span>
                  <p className="text-[11px] text-slate-500">{e.locationName || 'Phoenix Mall'} • Slot {e.slotNumber}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(e.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
