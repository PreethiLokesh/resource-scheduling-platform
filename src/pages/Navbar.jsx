import React from 'react';
import { LayoutDashboard, ShoppingBag, PlusCircle, History, Activity, Zap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userEmail }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'sell', label: 'Sell Resources', icon: PlusCircle },
        { id: 'rent', label: 'Marketplace', icon: ShoppingBag },
        { id: 'bookings', label: 'My Bookings', icon: History },
        { id: 'monitor', label: 'System Monitor', icon: Activity },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Zap className="w-8 h-8 fill-current" />
                    <span className="text-xl font-bold tracking-tight text-slate-900">ResourceNode</span>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Bottom wallet section */}
            <div className="p-4 border-t border-slate-100">
                <div className="bg-slate-900 rounded-2xl p-4 text-white">
                    <p className="text-xs text-slate-400 mb-1">Connected Wallet</p>
                    <p className="text-sm font-mono truncate">0x71C...3921</p>
                </div>
            </div>
        </aside>
    );
}