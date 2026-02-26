import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import Navbar from './pages/Navbar';
import Dashboard from './pages/Dashboard';
import SellResources from './pages/SellResources';
import RentResources from './pages/RentResources';
import MyBookings from './pages/MyBookings';
import SystemMonitor from './pages/SystemMonitor';
import LoginPage from './pages/Login';

export default function App() {
  // ─── Auth state ───────────────────────────────────────────
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rg_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem('rg_current_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('rg_current_user');
    setUser(null);
  };

  // ─── App state ────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resources, setResources] = useState(null);
  const [listings, setListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monitorData, setMonitorData] = useState([]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system-resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/bookings?email=${user.email}`);
      const data = await res.json();
      setMyBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchResources();
    fetchListings();
    fetchBookings();
    const interval = setInterval(() => {
      if (activeTab === 'monitor') fetchResources();
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTab, user]);

  useEffect(() => {
    if (resources) {
      setMonitorData(prev => [...prev, {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: parseFloat(resources.cpu.usage) * 10,
        ram: parseFloat(resources.ram.usagePercent),
      }].slice(-20));
    }
  }, [resources]);

  const handleBook = async (listingId) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          renter_email: user.email,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
        }),
      });
      if (res.ok) {
        alert('Booking successful!');
        fetchBookings();
        setActiveTab('bookings');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleListResource = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      user_email: user.email,
      resource_type: formData.get('type'),
      amount: formData.get('amount'),
      price_per_hour: parseFloat(formData.get('price')),
      time_slots: formData.get('slots'),
    };
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert('Resource listed successfully!');
        fetchListings();
        setActiveTab('rent');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ─── If not logged in → show login page ──────────────────
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ─── Logged in → show main app ────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <button
            onClick={fetchResources}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Get Current System Resources
          </button>
        </header>

        {/* Pages */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard key="dashboard" resources={resources} setActiveTab={setActiveTab} />}
            {activeTab === 'sell' && <SellResources key="sell" resources={resources} listings={listings} userEmail={user.email} handleListResource={handleListResource} fetchListings={fetchListings} />}
            {activeTab === 'rent' && <RentResources key="rent" listings={listings} handleBook={handleBook} />}
            {activeTab === 'bookings' && <MyBookings key="bookings" myBookings={myBookings} />}
            {activeTab === 'monitor' && <SystemMonitor key="monitor" resources={resources} monitorData={monitorData} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}