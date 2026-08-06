import React, { useState, useEffect } from 'react';
import { KeyRound, Car, ShieldCheck, Clock, CheckCircle2, Navigation } from 'lucide-react';
import API from '../services/api';

export default function ValetPage() {
  const [tickets, setTickets] = useState([]);
  const [keyTag, setKeyTag] = useState('');

  useEffect(() => {
    API.get('/valet')
      .then((res) => {
        if (res.data.success) {
          setTickets(res.data.tickets);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRequestValet = async () => {
    try {
      const res = await API.post('/valet', { keyTagNumber: keyTag || `VALET-KEY-502` });
      if (res.data.success) {
        setTickets((prev) => [res.data.ticket, ...prev]);
        setKeyTag('');
        alert('Valet requested successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Valet request failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">VIP Valet Parking Management</h1>
          <p className="text-xs text-slate-500 mt-1">Request valet drop-off, key tag tracking, and fast vehicle retrieval.</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Key Tag #VALET-502"
            value={keyTag}
            onChange={(e) => setKeyTag(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
          <button
            onClick={handleRequestValet}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md"
          >
            Request Valet Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((t) => (
          <div key={t.id} className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{t.keyTagNumber}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-500 font-bold text-[10px] uppercase">
                {t.status}
              </span>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>Vehicle: <strong className="text-slate-900 dark:text-white">{t.vehicle?.plateNumber || 'KA-01-MJ-4092'}</strong></p>
              <p>Valet Slot: <strong className="text-blue-500">{t.parkingSlot || 'Valet Bay V-04'}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
