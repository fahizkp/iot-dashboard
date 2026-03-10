import { Truck, Activity, AlertTriangle, Thermometer } from 'lucide-react';

export default function StatsBar({ stats }) {
    const cards = [
        {
            id: 'total-vehicles',
            label: 'Total Fleet',
            value: stats?.total ?? '—',
            icon: Truck,
            iconColor: 'text-primary-400',
            iconBg: 'bg-primary-500/15',
            gradient: 'from-primary-500/10 to-transparent',
        },
        {
            id: 'active-vehicles',
            label: 'Active Now',
            value: stats?.active ?? '—',
            icon: Activity,
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/15',
            gradient: 'from-emerald-500/10 to-transparent',
        },
        {
            id: 'temp-alerts',
            label: 'Temp Alerts',
            value: stats?.tempAlerts ?? '—',
            icon: AlertTriangle,
            iconColor: stats?.tempAlerts > 0 ? 'text-rose-400' : 'text-dark-400',
            iconBg: stats?.tempAlerts > 0 ? 'bg-rose-500/15' : 'bg-dark-700/40',
            gradient: stats?.tempAlerts > 0 ? 'from-rose-500/10 to-transparent' : 'from-dark-700/20 to-transparent',
            pulse: stats?.tempAlerts > 0,
        },
        {
            id: 'avg-temp',
            label: 'Avg Temp',
            value: stats?.avgTemp !== undefined ? `${stats.avgTemp}°C` : '—',
            icon: Thermometer,
            iconColor: 'text-cyan-400',
            iconBg: 'bg-cyan-500/15',
            gradient: 'from-cyan-500/10 to-transparent',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card, i) => (
                <div
                    key={card.id}
                    id={card.id}
                    className={`
            glass-card p-4 relative overflow-hidden
            animate-fade-in-up
          `}
                    style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
                >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none`} />

                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs text-dark-400 uppercase tracking-wider font-medium mb-1">
                                {card.label}
                            </p>
                            <p className={`text-2xl font-bold text-white ${card.pulse ? 'alert-pulse' : ''}`}>
                                {card.value}
                            </p>
                        </div>
                        <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                            <card.icon size={20} className={card.iconColor} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
