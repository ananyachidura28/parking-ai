import React, { useState, useEffect } from 'react';
import { Store, Plus, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: 'Bengaluru',
    hourlyRate: 35,
    dailyRate: 250,
    contactPhone: '+91 9812345678',
  });

  useEffect(() => {
    API.get('/marketplace')
      .then((res) => {
        if (res.data.success) {
          setListings(res.data.listings);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/marketplace', formData);
      if (res.data.success) {
        setListings((prev) => [res.data.listing, ...prev]);
        setShowAddForm(false);
        alert('Space listed successfully on Marketplace!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Listing creation failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Peer-to-Peer Parking Marketplace</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Rent out your private driveway or commercial parking space to earn passive income.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>List My Parking Space</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreateListing} className="glass-card p-6 rounded-3xl border border-emerald-500/50 space-y-4 max-w-xl mx-auto">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">List Your Driveway / Spot</h3>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              placeholder="e.g. Private Covered Spot near Phoenix Mall"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Hourly Rate (₹)</label>
              <input
                type="number"
                required
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs">
            Submit Listing
          </button>
        </form>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((l) => (
          <div key={l.id} className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase">
                VERIFIED DRIVEWAY
              </span>
              <span className="font-black text-sm text-emerald-500">₹{l.hourlyRate}/hr</span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{l.title}</h3>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{l.address}, {l.city}</span>
            </p>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>{l.contactPhone}</span>
              </span>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700">
                Book Private Spot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
