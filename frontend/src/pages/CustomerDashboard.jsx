import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Clock, 
  QrCode, 
  Zap, 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  Plus, 
  Building2, 
  Stethoscope,
  Navigation
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import API from '../services/api';

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const [activeReservation, setActiveReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', make: '', model: '', color: '', isEV: false });

  useEffect(() => {
    // Fetch Active Reservation
    API.get('/reservations/active')
      .then((res) => {
        if (res.data.success && res.data.activeReservation) {
          setActiveReservation(res.data.activeReservation);
        }
      })
      .catch((err) => console.error(err));

    // Fetch My Reservations History
    API.get('/reservations/my')
      .then((res) => {
        if (res.data.success) {
          setReservations(res.data.reservations);
        }
      })
      .catch((err) => console.error(err));

    // Fetch User Profile with Vehicles
    API.get('/auth/me')
      .then((res) => {
        if (res.data.success && res.data.user?.vehicles) {
          setVehicles(res.data.user.vehicles);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/vehicles', newVehicle);
      if (res.data.success) {
        setVehicles((prev) => [...prev, res.data.vehicle]);
        setShowAddVehicle(false);
        setNewVehicle({ plateNumber: '', make: '', model: '', color: '', isEV: false });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.fullName || 'Sarah Jenkins'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold text-[10px] uppercase border border-amber-500/30">
                {user?.membershipTier || 'Gold'} Member
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Role: {user?.role} • Loyalty Points: {user?.loyaltyPoints || 340} pts</p>
          </div>
        </div>

        {/* Quick Wallet Stats */}
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold space-y-0.5">
            <span className="text-[10px] uppercase text-slate-400 block font-medium">Wallet Balance</span>
            <span className="text-lg font-black">₹{user?.walletBalance || 850}.00</span>
          </div>
          <button
            onClick={() => setShowAddVehicle(true)}
            className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Active Reservation Live Card */}
      {activeReservation ? (
        <div className="glass-card p-6 rounded-3xl border border-blue-500/50 space-y-6 relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                  ACTIVE RESERVATION HOLD
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeReservation.location?.name || 'Phoenix Marketcity Mall'}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Booked Slot</span>
              <span className="text-2xl font-black text-blue-500">
                Slot {activeReservation.slot?.slotNumber || 'B1-03'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Vehicle Plate</span>
              <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                {activeReservation.vehicle?.plateNumber || 'KA-01-MJ-4092'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Zone & Floor</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {activeReservation.slot?.floor?.name || 'Basement 1'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Total Paid</span>
              <p className="font-bold text-sm text-emerald-500">
                ₹{activeReservation.totalAmount}
              </p>
            </div>
          </div>

          {/* QR Pass Teaser */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QrCode className="w-8 h-8 text-blue-400" />
              <span className="text-xs font-bold">Ready for ANPR Barrier Gate Scan</span>
            </div>
            <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
              Show Gate Pass
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center py-10 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Active Parking Reservations</h3>
          <p className="text-xs text-slate-500">Search Malls & Hospitals to book a slot instantly.</p>
        </div>
      )}

      {/* Two Columns: Registered Vehicles & Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Saved Vehicles */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Car className="w-5 h-5 text-blue-500" />
              <span>Registered Vehicles</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">{vehicles.length} Vehicles</span>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{v.plateNumber}</span>
                    {v.isEV && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 font-bold text-[10px]">
                        EV
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{v.make} {v.model} ({v.color || 'White'})</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Booking History */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>Booking Invoices</span>
            </h3>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {reservations.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{r.location?.name}</h4>
                  <p className="text-slate-500 text-[11px]">Slot {r.slot?.slotNumber} • {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-500 text-sm">₹{r.totalAmount}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
