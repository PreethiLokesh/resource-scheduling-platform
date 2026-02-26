import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Database, Zap, HardDrive, PlusCircle, ShoppingBag, History, ChevronRight } from 'lucide-react';

// Reusable Card component
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

// Reusable Stat component
const Stat = ({ label, value, subValue, icon: Icon, colorClass = 'text-indigo-600' }) => (
    <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-slate-50 ${colorClass}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
        </div>
    </div>
);

export default function Dashboard({ resources, setActiveTab }) {
    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* Resource Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <Stat label="CPU Cores" value={resources?.cpu.cores?.toString() || "0"} subValue={resources?.cpu.model} icon={Cpu} />
                </Card>
                <Card>
                    <Stat label="Total RAM" value={resources?.ram.total || "0 GB"} subValue={`${resources?.ram.available} available`} icon={Database} colorClass="text-emerald-600" />
                </Card>
                <Card>
                    <Stat label="GPU Status" value={resources?.gpu.status || "Offline"} subValue={resources?.gpu.available} icon={Zap} colorClass="text-amber-600" />
                </Card>
                <Card>
                    <Stat label="Storage" value={resources?.storage.total || "N/A"} subValue={`${resources?.storage.available} free`} icon={HardDrive} colorClass="text-rose-600" />
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Sell Resources", desc: "List your idle hardware for rent", icon: PlusCircle, tab: 'sell', color: "bg-indigo-600" },
                    { title: "Rent Resources", desc: "Browse available computing power", icon: ShoppingBag, tab: 'rent', color: "bg-emerald-600" },
                    { title: "View Bookings", desc: "Manage your active resource rentals", icon: History, tab: 'bookings', color: "bg-amber-600" },
                ].map((action) => (
                    <button
                        key={action.title}
                        onClick={() => setActiveTab(action.tab)}
                        className="group p-6 bg-white border border-slate-200 rounded-2xl text-left hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110 ${action.color}`}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{action.desc}</p>
                        <div className="flex items-center text-sm font-semibold text-indigo-600">
                            Get Started <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}