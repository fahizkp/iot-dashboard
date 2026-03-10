import { Thermometer, Droplets, MapPin, Clock, User, Truck } from 'lucide-react';

function getTemperatureColor(temp) {
    if (temp <= -15) return { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
    if (temp <= -10) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
    if (temp <= -5) return { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
    return { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' };
}

function getTemperatureLabel(temp) {
    if (temp <= -15) return 'Optimal';
    if (temp <= -10) return 'Normal';
    if (temp <= -5) return 'Warning';
    return 'Critical';
}

function getStatusConfig(status) {
    const map = {
        active: { dot: 'status-active', label: 'Active', textColor: 'text-emerald-400' },
        inactive: { dot: 'status-inactive', label: 'Inactive', textColor: 'text-dark-400' },
        maintenance: { dot: 'status-maintenance', label: 'Maintenance', textColor: 'text-amber-400' },
    };
    return map[status] || map.active;
}

function formatTimestamp(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString();
}

export default function VehicleCard({ vehicle, isSelected, onClick }) {
    const tempColor = getTemperatureColor(vehicle.lastTemperature?.value);
    const statusCfg = getStatusConfig(vehicle.status);
    const humidity = vehicle.lastHumidity?.value;

    return (
        <button
            id={`vehicle-card-${vehicle.vehicleId}`}
            onClick={() => onClick && onClick(vehicle)}
            className={`
        w-full text-left p-4 rounded-xl transition-all duration-300 group
        ${isSelected
                    ? 'bg-primary-600/15 border border-primary-500/40 shadow-neon'
                    : 'bg-dark-800/40 border border-dark-700/30 hover:bg-dark-800/70 hover:border-dark-600/50'
                }
      `}
        >
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${isSelected ? 'bg-primary-600/30' : 'bg-dark-700/60 group-hover:bg-dark-700/80'}
            transition-colors duration-300
          `}>
                        <Truck size={18} className={isSelected ? 'text-primary-400' : 'text-dark-300'} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm leading-tight">{vehicle.name}</h3>
                        <p className="text-xs text-dark-400 mt-0.5">
                            {vehicle.vehicleId} · {vehicle.licensePlate}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={`status-dot ${statusCfg.dot}`} />
                    <span className={`text-xs font-medium ${statusCfg.textColor}`}>
                        {statusCfg.label}
                    </span>
                </div>
            </div>

            {/* Sensor readings grid */}
            <div className={`grid gap-2 mb-3 ${humidity !== null && humidity !== undefined ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {/* Temperature */}
                <div className={`px-2.5 py-2 rounded-lg ${tempColor.bg} border ${tempColor.border}`}>
                    <div className="flex items-center gap-1 mb-1">
                        <Thermometer size={11} className={tempColor.text} />
                        <span className="text-[9px] text-dark-400 uppercase tracking-wider font-medium">Temp</span>
                    </div>
                    <div className={`text-base font-bold ${tempColor.text} leading-none`}>
                        {vehicle.lastTemperature?.value?.toFixed(1)}°C
                    </div>
                    <div className={`text-[9px] ${tempColor.text} mt-0.5 opacity-80`}>
                        {getTemperatureLabel(vehicle.lastTemperature?.value)}
                    </div>
                </div>

                {/* Humidity — only shown when data exists */}
                {humidity !== null && humidity !== undefined && (
                    <div className="px-2.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <div className="flex items-center gap-1 mb-1">
                            <Droplets size={11} className="text-cyan-400" />
                            <span className="text-[9px] text-dark-400 uppercase tracking-wider font-medium">Humidity</span>
                        </div>
                        <div className="text-base font-bold text-cyan-400 leading-none">
                            {humidity.toFixed(1)}%
                        </div>
                        <div className="text-[9px] text-cyan-400 mt-0.5 opacity-80">
                            RH
                        </div>
                    </div>
                )}

                {/* Location */}
                <div className="px-2.5 py-2 rounded-lg bg-dark-700/30 border border-dark-700/20">
                    <div className="flex items-center gap-1 mb-1">
                        <MapPin size={11} className="text-dark-400" />
                        <span className="text-[9px] text-dark-400 uppercase tracking-wider font-medium">Location</span>
                    </div>
                    <div className="text-[11px] text-dark-200 font-mono leading-tight">
                        {vehicle.lastLocation?.lat?.toFixed(4)}
                    </div>
                    <div className="text-[11px] text-dark-200 font-mono leading-tight">
                        {vehicle.lastLocation?.lng?.toFixed(4)}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-dark-400">
                <div className="flex items-center gap-1.5">
                    <User size={11} />
                    <span>{vehicle.driverName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={11} />
                    <span>{formatTimestamp(vehicle.lastLocation?.updatedAt)}</span>
                </div>
            </div>
        </button>
    );
}
