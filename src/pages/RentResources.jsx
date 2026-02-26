import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Cpu, Database, Zap, HardDrive, Clock } from 'lucide-react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ${className}`}>
        {children}
    </div>
);

const ResourceIcon = ({ type }) => {
    if (type === 'CPU') return <Cpu className="w-6 h-6" />;
    if (type === 'RAM') return <Database className="w-6 h-6" />;
    if (type === 'GPU') return <Zap className="w-6 h-6" />;
    return <HardDrive className="w-6 h-6" />;
};

export default function RentResources({ listings, handleBook }) {
    return (
        <motion.div
            key="rent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">Marketplace is Empty</h3>
                        <p className="text-slate-500">Check back later or list your own resources!</p>
                    </div>
                ) : (
                    listings.map(listing => (
                        <Card key={listing.id} className="hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <ResourceIcon type={listing.resource_type} />
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-900">${listing.price_per_hour}</p>
                                    <p className="text-xs text-slate-500">per hour</p>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{listing.amount} {listing.resource_type}</h3>
                            <p className="text-sm text-slate-500 mb-4 truncate">Provider: {listing.user_email}</p>
                            <div className="flex items-center gap-4 mb-6 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {listing.time_slots}
                                </div>
                            </div>
                            <button
                                onClick={() => handleBook(listing.id)}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                Book Resource
                            </button>
                        </Card>
                    ))
                )}
            </div>
        </motion.div>
    );
}