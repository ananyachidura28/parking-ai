import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import SearchLocations from './pages/SearchLocations';
import SlotBookingPage from './pages/SlotBookingPage';
import CustomerDashboard from './pages/CustomerDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import ValetPage from './pages/ValetPage';
import MarketplacePage from './pages/MarketplacePage';
import AdminDashboard from './pages/AdminDashboard';
import CarWashServicePage from './pages/CarWashServicePage';
import ANPRBarrierSimulator from './components/ANPRBarrierSimulator';
import IndoorPathMap from './components/IndoorPathMap';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

function DashboardSwitch() {
  const { user } = useAuthStore();
  if (user?.role === 'PARKING_OPERATOR' || user?.role === 'MALL_OWNER') {
    return <OperatorDashboard />;
  }
  if (user?.role === 'ADMINISTRATOR') {
    return <AdminDashboard />;
  }
  if (user?.role === 'VALET_STAFF') {
    return <ValetPage />;
  }
  return <CustomerDashboard />;
}

export default function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchLocations />} />
        <Route path="/book/:slug" element={<SlotBookingPage />} />
        <Route path="/dashboard" element={<DashboardSwitch />} />
        <Route path="/anpr" element={
          <div className="max-w-4xl mx-auto px-6 py-10">
            <ANPRBarrierSimulator defaultLocationId="phoenix-marketcity-mall" />
          </div>
        } />
        <Route path="/indoor-nav" element={
          <div className="max-w-4xl mx-auto px-6 py-10">
            <IndoorPathMap slotNumber="B1-03" floorName="Phoenix Mall Basement Level 1" />
          </div>
        } />
        <Route path="/ev-charging" element={<SearchLocations />} />
        <Route path="/find-vehicle" element={
          <div className="max-w-4xl mx-auto px-6 py-10">
            <IndoorPathMap slotNumber="B1-03" floorName="Find My Parked Vehicle Route" />
          </div>
        } />
        <Route path="/valet" element={<ValetPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/services" element={<CarWashServicePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </MainLayout>
  );
}
