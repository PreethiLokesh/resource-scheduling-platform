import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, PlusCircle, History, Activity, Zap, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'sell', label: 'Sell Resources', icon: PlusCircle },
        { id: 'rent', label: 'Marketplace', icon: ShoppingBag },
        { id: 'bookings', label: 'My Bookings', icon: History },
        { id: 'monitor', label: 'System Monitor', icon: Activity },
    ];

    // Get initials from name e.g. "Preethi Lokesh" → "PL"
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Pick a consistent color based on name
    const avatarColors = [
        'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500',
        'bg-rose-500', 'bg-cyan-500', 'bg-violet-500',
    ];
    const colorIndex = (user?.name?.charCodeAt(0) || 0) % avatarColors.length;
    const avatarColor = avatarColors[colorIndex];

    return (
        <>
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

                {/* User info + Logout */}
                <div className="p-4 border-t border-slate-100 space-y-3">
                    {user && (
                        <div className="flex items-center gap-3 px-2">
                            {/* Clean initial avatar */}
                            <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}>
                                <span className="text-white text-sm font-bold">{getInitials(user.name)}</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-slate-800 truncate">{user.name || 'User'}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Logout button */}
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Popup */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-full max-w-sm text-center">
                        {/* Icon */}
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Logout?</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to log out of ResourceNode?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { setShowConfirm(false); onLogout(); }}
                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}