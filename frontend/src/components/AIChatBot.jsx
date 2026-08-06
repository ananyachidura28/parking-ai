import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, AlertTriangle, PhoneCall, Zap, Building2 } from 'lucide-react';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am ParkBot AI 🤖. How can I help you with slot booking, indoor navigation, or valet today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let botReply = "I'm analyzing live parking occupancy. Best available EV slot is B1-03 at Phoenix Marketcity Mall!";
      const lower = text.toLowerCase();

      if (lower.includes('hospital') || lower.includes('opd') || lower.includes('apollo')) {
        botReply = "Apollo Hospital OPD Wing has 14 accessible slots free right now on Basement Level 1. Direct elevator connect to Room 102!";
      } else if (lower.includes('valet') || lower.includes('retrieval')) {
        botReply = "Valet request received! Your vehicle key tag #VALET-409 is dispatched. Valet staff will meet you at Gate 2 in 4 minutes.";
      } else if (lower.includes('ev') || lower.includes('charger')) {
        botReply = "We have 150kW Ultra-Fast Chargers active at Phoenix Mall B1 Zone C. 3 chargers currently free @ ₹30/hr.";
      } else if (lower.includes('sos') || lower.includes('emergency')) {
        botReply = "🚨 EMERGENCY SOS TRIGGERED! Location relayed to Security Control Room & Hospital Dispatch. Guards dispatched to your sector.";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-blue-500/40 hover:scale-110 transition-all flex items-center space-x-2 font-bold text-xs"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline">Ask ParkBot AI</span>
      </button>

      {/* Chat Dialog Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[480px]"
          >
            {/* Top Bar */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">ParkBot AI Assistant</h4>
                  <p className="text-[10px] text-blue-100 font-medium">Real-Time Parking Guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Chips */}
            <div className="p-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none text-[10px]">
              <button
                onClick={() => handleSend("Show Apollo Hospital OPD Parking")}
                className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap border border-rose-500/20"
              >
                🏥 Hospital Slots
              </button>
              <button
                onClick={() => handleSend("Find EV chargers at Mall")}
                className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap border border-blue-500/20"
              >
                ⚡ EV Hubs
              </button>
              <button
                onClick={() => handleSend("Request SOS Emergency Security")}
                className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap border border-amber-500/20"
              >
                🚨 SOS Security
              </button>
            </div>

            {/* Chat Scroll Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none font-normal'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 bg-white dark:bg-slate-900"
            >
              <input
                type="text"
                placeholder="Ask about slot availability, EV, valet..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
