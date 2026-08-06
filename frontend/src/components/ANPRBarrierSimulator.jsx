import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ShieldCheck, CheckCircle, AlertTriangle, ArrowRight, FileText, Sparkles } from 'lucide-react';
import API from '../services/api';

export default function ANPRBarrierSimulator({ defaultLocationId = '' }) {
  const [plateNumber, setPlateNumber] = useState('KA-01-MJ-4092');
  const [locationId, setLocationId] = useState(defaultLocationId);
  const [scanning, setScanning] = useState(false);
  const [barrierState, setBarrierState] = useState('CLOSED'); // CLOSED, OPENING, OPEN
  const [resultMessage, setResultMessage] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const handleSimulateEntry = async () => {
    if (!plateNumber) return;
    setScanning(true);
    setResultMessage(null);
    setReceipt(null);

    setTimeout(async () => {
      try {
        const res = await API.post('/anpr/entry', {
          plateNumber,
          locationId: locationId || 'phoenix-marketcity-mall',
        });

        setScanning(false);
        if (res.data.success) {
          setBarrierState('OPEN');
          setResultMessage({
            type: 'success',
            title: 'Barrier Raised - ANPR Entry Granted',
            text: res.data.message,
          });
        }
      } catch (err) {
        setScanning(false);
        setResultMessage({
          type: 'error',
          title: 'ANPR Verification Failed',
          text: err.response?.data?.message || 'Barrier closed.',
        });
      }
    }, 1200);
  };

  const handleSimulateExit = async () => {
    if (!plateNumber) return;
    setScanning(true);
    setResultMessage(null);

    setTimeout(async () => {
      try {
        const res = await API.post('/anpr/exit', {
          plateNumber,
          locationId: locationId || 'phoenix-marketcity-mall',
        });

        setScanning(false);
        if (res.data.success) {
          setBarrierState('OPEN');
          setResultMessage({
            type: 'success',
            title: 'ANPR Exit Verified',
            text: res.data.message,
          });
          if (res.data.invoice) {
            setReceipt(res.data.invoice);
          }
        }
      } catch (err) {
        setScanning(false);
      }
    }, 1200);
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">ANPR Barrier Simulation</h3>
            <p className="text-xs text-slate-500">Automatic License Plate Recognition Gate</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          barrierState === 'OPEN' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
        }`}>
          Barrier {barrierState}
        </span>
      </div>

      {/* Simulator Visual Display */}
      <div className="relative h-48 rounded-2xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-center p-6 border border-slate-800">
        
        {/* Laser scanner line effect */}
        {scanning && (
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 80 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500 shadow-lg shadow-emerald-500/50 z-20"
          />
        )}

        {/* License Plate Graphic */}
        <div className="relative z-10 bg-amber-400 text-slate-950 font-mono font-black text-xl tracking-widest px-6 py-2 rounded-lg border-2 border-slate-900 shadow-2xl flex items-center space-x-3">
          <span className="text-[10px] border-r border-slate-900/30 pr-2 uppercase">IND</span>
          <span>{plateNumber || 'KA-01-MJ-4092'}</span>
        </div>

        {/* Barrier arm graphic */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
          <div className="w-4 h-12 bg-slate-700 rounded-t-md"></div>
          <div className={`h-2 flex-1 mx-2 transition-transform duration-700 origin-left ${
            barrierState === 'OPEN' ? '-rotate-45 bg-emerald-500' : 'bg-rose-500'
          }`}></div>
          <div className="w-4 h-12 bg-slate-700 rounded-t-md"></div>
        </div>
      </div>

      {/* Inputs and Controls */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Vehicle License Plate</label>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. KA-01-MJ-4092"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSimulateEntry}
            disabled={scanning}
            className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Simulate Entry Gate</span>
          </button>
          <button
            onClick={handleSimulateExit}
            disabled={scanning}
            className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Simulate Exit Gate</span>
          </button>
        </div>
      </div>

      {/* Result feedback */}
      {resultMessage && (
        <div className={`p-4 rounded-xl text-xs font-medium border ${
          resultMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
        }`}>
          <div className="font-bold mb-1 flex items-center space-x-1.5">
            {resultMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{resultMessage.title}</span>
          </div>
          <p>{resultMessage.text}</p>
        </div>
      )}

      {/* Exit Invoice Receipt */}
      {receipt && (
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5 font-bold">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Exit Digital Receipt</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">PAID VIA AUTO-ANPR</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Plate:</span>
            <span className="font-mono text-white font-bold">{receipt.plateNumber}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Slot:</span>
            <span className="text-white font-bold">{receipt.slotNumber}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Duration:</span>
            <span className="text-white font-bold">{receipt.duration}</span>
          </div>
          <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2 font-bold text-sm">
            <span>Total Paid:</span>
            <span className="text-emerald-400">{receipt.totalPaid}</span>
          </div>
        </div>
      )}
    </div>
  );
}
