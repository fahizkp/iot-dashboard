import { useState } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, Truck } from 'lucide-react';
import VehicleCard from './VehicleCard';

export default function Sidebar({
    vehicles = [],
    selectedVehicle,
    onSelectVehicle,
    isExpanded,
    onToggleExpand,
}) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = vehicles.filter((v) => {
        const matchesSearch =
            !search ||
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
            v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
            (v.driverName && v.driverName.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: vehicles.length,
        active: vehicles.filter((v) => v.status === 'active').length,
        inactive: vehicles.filter((v) => v.status === 'inactive').length,
        maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
    };

    return (
        <div
            className={`
        sidebar-container glass-card flex flex-col
        ${isExpanded ? 'expanded' : ''}
      `}
        >
            {/* Mobile drag handle */}
            <div className="md:hidden flex justify-center pt-2 pb-1">
                <button
                    onClick={onToggleExpand}
                    className="w-10 h-1.5 bg-dark-600 rounded-full hover:bg-dark-500 transition-colors"
                    aria-label="Toggle sidebar"
                />
            </div>

            {/* Header */}
            <div className="p-4 pb-3 border-b border-dark-700/30">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center">
                            <Truck size={16} className="text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">Fleet Tracker</h2>
                            <p className="text-[10px] text-dark-400">{vehicles.length} vehicles</p>
                        </div>
                    </div>
                    <button
                        className="hidden md:flex items-center gap-1 text-xs text-dark-400 hover:text-dark-200 transition-colors"
                        onClick={onToggleExpand}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                    <input
                        id="vehicle-search"
                        type="text"
                        placeholder="Search vehicles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-dark-800/80 border border-dark-700/50 rounded-lg
                       text-dark-200 placeholder-dark-500
                       focus:ring-1 focus:ring-primary-500/30 focus:border-primary-500/30
                       outline-none transition-all duration-200"
                    />
                </div>

                {/* Filter pills */}
                <div className="flex gap-1.5 flex-wrap">
                    {['all', 'active', 'inactive', 'maintenance'].map((s) => (
                        <button
                            key={s}
                            id={`filter-${s}`}
                            onClick={() => setStatusFilter(s)}
                            className={`
                px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all duration-200 capitalize
                ${statusFilter === s
                                    ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30'
                                    : 'bg-dark-700/40 text-dark-400 border border-dark-700/30 hover:bg-dark-700/60 hover:text-dark-300'
                                }
              `}
                        >
                            {s} ({statusCounts[s]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Vehicle list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-dark-500">
                        <Truck size={32} className="mb-2 opacity-30" />
                        <p className="text-sm">No vehicles found</p>
                    </div>
                ) : (
                    filtered.map((v) => (
                        <VehicleCard
                            key={v.vehicleId}
                            vehicle={v}
                            isSelected={selectedVehicle?.vehicleId === v.vehicleId}
                            onClick={onSelectVehicle}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
