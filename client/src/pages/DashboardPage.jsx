import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Wifi, WifiOff, Zap } from 'lucide-react';
import MapView from '../components/dashboard/MapView';
import Sidebar from '../components/dashboard/Sidebar';
import StatsBar from '../components/dashboard/StatsBar';
import { vehiclesAPI, iotAPI } from '../services/vehicleService';

export default function DashboardPage() {
    const [vehicles, setVehicles] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulateMsg, setSimulateMsg] = useState(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const fetchData = useCallback(async (showSpinner = false) => {
        try {
            if (showSpinner) setIsRefreshing(true);

            const [vehiclesRes, statsRes] = await Promise.all([
                vehiclesAPI.getAll(),
                vehiclesAPI.getStats(),
            ]);

            const freshVehicles = vehiclesRes.data.data || [];
            setVehicles(freshVehicles);
            setStats(statsRes.data.data || null);
            setLastRefresh(new Date());
            setError(null);

            // Keep selected vehicle in sync
            if (selectedVehicle) {
                const updated = freshVehicles.find(v => v.vehicleId === selectedVehicle.vehicleId);
                if (updated) setSelectedVehicle(updated);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load fleet data. Is the server running?');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [selectedVehicle]);

    // Initial fetch
    useEffect(() => { fetchData(); }, []);

    // Auto-refresh every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => fetchData(false), 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleRefresh = () => fetchData(true);

    const handleSelectVehicle = (vehicle) => {
        setSelectedVehicle(
            selectedVehicle?.vehicleId === vehicle.vehicleId ? null : vehicle
        );
        if (window.innerWidth < 768) setSidebarExpanded(false);
    };

    /**
     * Simulate a telemetry push from a random active vehicle.
     * Useful for testing the dashboard before the live IoT API is ready.
     */
    const handleSimulate = async () => {
        setIsSimulating(true);
        setSimulateMsg(null);
        try {
            const vehicleId = selectedVehicle?.vehicleId || null;
            const res = await iotAPI.simulate(vehicleId);
            const simData = res.data?.simulated;
            const name = res.data?.vehicle?.name || vehicleId || 'a vehicle';
            setSimulateMsg(
                `📡 ${name} — Temp: ${simData?.temperature?.toFixed(1)}°C | Humidity: ${simData?.humidity?.toFixed(1)}%`
            );
            // Refresh data to show the new position on map
            await fetchData(false);
        } catch (err) {
            setSimulateMsg('Simulation failed — check server logs.');
        } finally {
            setIsSimulating(false);
            // Auto-dismiss after 4s
            setTimeout(() => setSimulateMsg(null), 4000);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-dark-950">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-primary-600/20 flex items-center justify-center">
                        <RefreshCw size={28} className="text-primary-400 animate-spin" />
                    </div>
                    <div className="text-center">
                        <p className="text-dark-200 font-medium">Loading Fleet Data</p>
                        <p className="text-dark-500 text-sm mt-1">Connecting to IoT devices...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-dark-950 overflow-hidden">
            {/* Top Bar */}
            <div className="px-4 md:px-6 py-3 border-b border-dark-800/50">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-white">Fleet Dashboard</h1>
                        <p className="text-xs text-dark-400">Real-time monitoring &amp; tracking</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Connection status */}
                        <div className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
              ${error
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }
            `}>
                            {error ? <WifiOff size={12} /> : <Wifi size={12} />}
                            <span className="hidden sm:inline">{error ? 'Offline' : 'Connected'}</span>
                        </div>

                        {/* Last refresh time */}
                        {lastRefresh && (
                            <span className="text-[11px] text-dark-500 hidden sm:block">
                                Updated {lastRefresh.toLocaleTimeString()}
                            </span>
                        )}

                        {/* Simulate button — for testing before live API */}
                        <button
                            id="simulate-btn"
                            onClick={handleSimulate}
                            disabled={isSimulating}
                            className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-amber-500/10 border border-amber-500/20 text-amber-400
                hover:bg-amber-500/20 transition-all duration-200
                disabled:opacity-50 text-xs font-medium
              "
                            title="Simulate a live IoT telemetry event"
                        >
                            <Zap size={13} className={isSimulating ? 'animate-pulse' : ''} />
                            <span className="hidden sm:inline">
                                {isSimulating ? 'Sending...' : 'Simulate'}
                            </span>
                        </button>

                        {/* Refresh button */}
                        <button
                            id="refresh-btn"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="
                p-2 rounded-lg bg-dark-800/60 border border-dark-700/30
                text-dark-400 hover:text-dark-200 hover:bg-dark-700/60
                transition-all duration-200 disabled:opacity-50
              "
                            title="Refresh data"
                        >
                            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <StatsBar stats={stats} />
            </div>

            {/* Simulate feedback toast */}
            {simulateMsg && (
                <div className="mx-4 md:mx-6 mt-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm animate-fade-in flex items-center gap-2">
                    <Zap size={14} />
                    {simulateMsg}
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div className="mx-4 md:mx-6 mt-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm animate-fade-in">
                    {error}
                </div>
            )}

            {/* Main content: Map + Sidebar */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Map */}
                <div className="flex-1 p-3 md:p-4 min-h-[300px]">
                    <MapView
                        vehicles={vehicles}
                        selectedVehicle={selectedVehicle}
                        onSelectVehicle={handleSelectVehicle}
                    />
                </div>

                {/* Sidebar */}
                <div className="
          md:w-[380px] lg:w-[400px]
          md:border-l md:border-dark-800/50
          md:relative flex-shrink-0
        ">
                    <Sidebar
                        vehicles={vehicles}
                        selectedVehicle={selectedVehicle}
                        onSelectVehicle={handleSelectVehicle}
                        isExpanded={sidebarExpanded}
                        onToggleExpand={() => setSidebarExpanded(!sidebarExpanded)}
                    />
                </div>
            </div>
        </div>
    );
}
