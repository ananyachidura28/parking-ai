import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { ShieldCheck, TrendingUp, Users, MapPin, DollarSign, Zap } from 'lucide-react';
import API from '../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/analytics/dashboard')
      .then((res) => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const occupancyTrend = data?.occupancyTrend || [
    { day: 'Mon', occupancyRate: 64, revenue: 1420 },
    { day: 'Tue', occupancyRate: 72, revenue: 1890 },
    { day: 'Wed', occupancyRate: 78, revenue: 2150 },
    { day: 'Thu', occupancyRate: 85, revenue: 2680 },
    { day: 'Fri', occupancyRate: 92, revenue: 3450 },
    { day: 'Sat', occupancyRate: 98, revenue: 4900 },
    { day: 'Sun', occupancyRate: 95, revenue: 4600 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Platform Administrator Control Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Global Smart Parking Ecosystem Analytics & AI Yield Prediction</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Growth Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Weekly Revenue Analytics (₹)</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Peak Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span>Peak Day Occupancy %</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="occupancyRate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
