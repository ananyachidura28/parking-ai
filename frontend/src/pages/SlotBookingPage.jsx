import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Stethoscope, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  QrCode, 
  X, 
  MapPin,
  Star,
  Navigation
} from 'lucide-react';
import CompulsorySlotGrid from '../components/CompulsorySlotGrid';
import IndoorPathMap from '../components/IndoorPathMap';
import { socket } from '../services/socket';
import API from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import confetti from 'canvas-confetti';

export default function SlotBookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [location, setLocation] = useState(null);
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [aiRecommendedSlot, setAiRecommendedSlot] = useState(null);
  const [durationHours, setDurationHours] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Fetch Location Details & Slots
  useEffect(() => {
    API.get(`/locations/${slug || 'phoenix-marketcity-mall'}`)
      .then((res) => {
        if (res.data.success) {
          setLocation(res.data.location);

          // Get AI recommendation
          API.get(`/locations/${res.data.location.id}/ai-recommend`, {
            params: { isEV: 'true' }
          }).then((aiRes) => {
            if (aiRes.data.success && aiRes.data.recommendedSlot) {
              setAiRecommendedSlot(aiRes.data.recommendedSlot);
            }
          }).catch(() => {});
        }
      })
      .catch((err) => console.error(err));
  }, [slug]);

  // Real-Time Socket.IO Slot Sync
  useEffect(() => {
    if (!location?.id) return;

    socket.emit('join_location', location.id);

    socket.on('slot_status_changed', ({ slotId, newStatus }) => {
      setLocation((prev) => {
        if (!prev) return prev;
        const updatedFloors = prev.floors.map((floor) => ({
          ...floor,
          slots: floor.slots.map((slot) =>
            slot.id === slotId ? { ...slot, status: newStatus } : slot
          ),
        }));
        return { ...prev, floors: updatedFloors };
      });
    });

    return () => {
      socket.emit('leave_location', location.id);
      socket.off('slot_status_changed');
    };
  }, [location?.id]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);

    try {
      const res = await API.post('/reservations', {
        locationId: location.id,
        slotId: selectedSlot.id,
        durationHours,
        paymentMethod,
      });

      setIsSubmitting(false);
      if (res.data.success) {
        setConfirmedReservation(res.data.reservation);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Reservation failed');
    }
  };

  if (!location) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading real-time parking floor map...</p>
      </div>
    );
  }

  const floors = location.floors || [];
  const currentFloor = floors[activeFloorIndex] || floors[0];
  const calculatedTotal = (selectedSlot?.hourlyPrice || location.hourlyRate) * durationHours;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Location Banner Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold text-[10px] uppercase tracking-wider">
                {location.category}
              </span>
              <span className="flex items-center space-x-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{location.rating || 4.9}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {location.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{location.address}, {location.city}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              ₹{location.hourlyRate}/hr Base Rate
            </div>
            {location.hasEVCharging && (
              <div className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 fill-blue-500" />
                <span>150kW EV Fast Hub</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {aiRecommendedSlot && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">AI Recommendation: </span>
                <span className="text-slate-600 dark:text-slate-300">
                  Slot <strong className="text-blue-500 font-extrabold">{aiRecommendedSlot.slotNumber}</strong> in {aiRecommendedSlot.zone} is optimal for elevator access.
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedSlot(aiRecommendedSlot)}
              className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px] hover:scale-105 transition-all"
            >
              Auto Select AI Slot
            </button>
          </div>
        )}
      </div>

      {/* Main Grid & Checkout Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: COMPULSORY VISUAL SLOT SELECTOR */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              1. Compulsory Visual Slot Selection
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real-Time Socket.IO Active</span>
          </div>

          <CompulsorySlotGrid
            floors={floors}
            activeFloorIndex={activeFloorIndex}
            setActiveFloorIndex={setActiveFloorIndex}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            aiRecommendedSlotId={aiRecommendedSlot?.id}
          />

          <IndoorPathMap
            slotNumber={selectedSlot?.slotNumber || 'B1-03'}
            floorName={currentFloor?.name || 'Basement 1'}
          />
        </div>

        {/* Right 1 Col: RESERVATION CHECKOUT SUMMARY */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 sticky top-24">
            
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              2. Reservation & Payment Summary
            </h3>

            {/* Selected Slot Summary */}
            {selectedSlot ? (
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">SELECTED SLOT</span>
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px]">
                    {selectedSlot.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    Slot {selectedSlot.slotNumber}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedSlot.zone}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Elevator Distance: {selectedSlot.distanceToLift} meters
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold text-center">
                Please click an AVAILABLE green slot on the map to proceed.
              </div>
            )}

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Parking Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].map((h) => (
                  <button
                    key={h}
                    onClick={() => setDurationHours(h)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      durationHours === h
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {h} {h === 1 ? 'Hour' : 'Hours'}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CREDIT_CARD', label: 'Card', icon: CreditCard },
                  { id: 'WALLET', label: 'Wallet', icon: Wallet },
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 border ${
                        paymentMethod === pm.id
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Price breakdown */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Slot Rate ({durationHours} hrs)</span>
                <span>₹{calculatedTotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>ANPR Gate & Service Fee</span>
                <span className="text-emerald-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Payable</span>
                <span className="text-blue-600 dark:text-blue-400">₹{calculatedTotal}</span>
              </div>
            </div>

            {/* Confirm CTA */}
            <button
              onClick={handleConfirmBooking}
              disabled={!selectedSlot || isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm Slot Reservation</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Booking Confirmation QR Pass Modal */}
      <AnimatePresence>
        {confirmedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-md p-6 rounded-3xl border border-slate-800 space-y-6 text-center relative"
            >
              <button
                onClick={() => {
                  setConfirmedReservation(null);
                  navigate('/dashboard');
                }}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Slot Reservation Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">Present this QR Code at the ANPR Barrier Gate</p>
              </div>

              {/* QR Code Pass */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-xl border border-slate-200">
                <img
                  src={confirmedReservation.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PARK-CONFIRMED'}
                  alt="QR Pass"
                  className="w-44 h-44 mx-auto"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-xs text-left space-y-1.5 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-bold text-white">{location.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reserved Slot:</span>
                  <span className="font-bold text-blue-400">{selectedSlot?.slotNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="font-bold text-emerald-400">₹{confirmedReservation.totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setConfirmedReservation(null);
                  navigate('/dashboard');
                }}
                className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-lg"
              >
                Go To My Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
