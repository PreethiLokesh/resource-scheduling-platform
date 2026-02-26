import React from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Activity, Cpu, Database } from 'lucide-react';

const Card = ({ children, className = '', title, icon: Icon }) => (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ${className}`}>
        {title && (
            <div className="flex items-center gap-2 mb-4">
                {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
                <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>
        )}
        {children}
    </div>
);

export default function SellResources({ resources, listings, userEmail, handleListResource, fetchListings }) {
    return (
        <motion.div
            key="sell"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            <div className="lg:col-span-2 space-y-6">
                {/* List New Resource Form */}
                <Card title="List New Resource" icon={PlusCircle}>
                    <form onSubmit={handleListResource} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Resource Type</label>
                                <select name="type" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="RAM">RAM</option>
                                    <option value="CPU">CPU</option>
                                    <option value="GPU">GPU</option>
                                    <option value="Storage">Storage</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Amount</label>
                                <input name="amount" type="text" placeholder="e.g. 16GB, 4 Cores" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Price per Hour ($)</label>
                                <input name="price" type="number" step="0.01" placeholder="0.50" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Available Slots</label>
                                <input name="slots" type="text" placeholder="e.g. 09:00 - 18:00" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                            List Resource
                        </button>
                    </form>
                </Card>

                {/* My Active Listings */}
                <Card title="Your Active Listings" icon={Activity}>
                    <div className="space-y-4">
                        {listings.filter(l => l.user_email === userEmail).length === 0 ? (
                            <p className="text-center py-8 text-slate-400 italic">No active listings found.</p>
                        ) : (
                            listings.filter(l => l.user_email === userEmail).map(listing => (
                                <div key={listing.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            {listing.resource_type === 'CPU' ? <Cpu className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{listing.amount} {listing.resource_type}</p>
                                            <p className="text-xs text-slate-500">${listing.price_per_hour}/hr • {listing.time_slots}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await fetch(`/api/listings/${listing.id}`, { method: 'DELETE' });
                                            fetchListings();
                                        }}
                                        className="px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Sidebar - Current Stats */}
            <div className="space-y-6">
                <Card title="Current System Stats" icon={Activity}>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs font-medium text-slate-500 uppercase mb-1">CPU Load</p>
                            <div className="flex items-end justify-between">
                                <p className="text-xl font-bold text-slate-900">{resources?.cpu.usage || "0.00"}</p>
                                <p className="text-xs text-emerald-600 font-medium">Healthy</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs font-medium text-slate-500 uppercase mb-1">RAM Usage</p>
                            <div className="flex items-end justify-between">
                                <p className="text-xl font-bold text-slate-900">{resources?.ram.usagePercent || "0"}%</p>
                                <p className="text-xs text-slate-400">{resources?.ram.available} free</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}