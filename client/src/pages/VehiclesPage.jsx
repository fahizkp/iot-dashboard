import { useState, useEffect } from 'react';
import {
    Plus, Pencil, Trash2, X, Save, Truck, Search,
    Thermometer, MapPin, Clock, AlertTriangle, CheckCircle
} from 'lucide-react';
import { vehiclesAPI } from '../services/vehicleService';
import toast from 'react-hot-toast';

const emptyForm = {
    vehicleId: '',
    name: '',
    licensePlate: '',
    driverName: '',
    driverPhone: '',
    iotDeviceId: '',
    status: 'active',
};

function getTemperatureColor(temp) {
    if (temp <= -15) return 'text-blue-400';
    if (temp <= -10) return 'text-emerald-400';
    if (temp <= -5) return 'text-amber-400';
    return 'text-rose-400';
}

function getStatusBadge(status) {
    const map = {
        active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        inactive: 'bg-dark-600/30 text-dark-400 border-dark-600/30',
        maintenance: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    };
    return map[status] || map.active;
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchVehicles = async () => {
        try {
            const res = await vehiclesAPI.getAll();
            setVehicles(res.data.data || []);
        } catch (err) {
            toast.error('Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVehicles(); }, []);

    const filtered = vehicles.filter((v) =>
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
        (v.driverName && v.driverName.toLowerCase().includes(search.toLowerCase()))
    );

    const openForm = (vehicle = null) => {
        if (vehicle) {
            setEditingId(vehicle.vehicleId);
            setForm({
                vehicleId: vehicle.vehicleId,
                name: vehicle.name,
                licensePlate: vehicle.licensePlate,
                driverName: vehicle.driverName || '',
                driverPhone: vehicle.driverPhone || '',
                iotDeviceId: vehicle.iotDeviceId,
                status: vehicle.status,
            });
        } else {
            setEditingId(null);
            setForm(emptyForm);
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await vehiclesAPI.update(editingId, form);
                toast.success('Vehicle updated');
            } else {
                await vehiclesAPI.create(form);
                toast.success('Vehicle created');
            }
            closeForm();
            fetchVehicles();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save vehicle');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Delete vehicle ${id}? This action cannot be undone.`)) return;
        try {
            await vehiclesAPI.delete(id);
            toast.success('Vehicle deleted');
            fetchVehicles();
        } catch (err) {
            toast.error('Failed to delete vehicle');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-dark-950">
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                    <Truck size={36} className="text-primary-400 animate-pulse" />
                    <p className="text-dark-400">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-dark-950 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Vehicle Management</h1>
                        <p className="text-sm text-dark-400 mt-1">{vehicles.length} vehicles in fleet</p>
                    </div>
                    <button
                        id="add-vehicle-btn"
                        onClick={() => openForm()}
                        className="btn-primary"
                    >
                        <Plus size={18} />
                        Add Vehicle
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6 max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                    <input
                        id="vehicles-search"
                        type="text"
                        placeholder="Search by name, ID, plate, or driver..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((v, i) => (
                        <div
                            key={v.vehicleId}
                            className="glass-card-hover p-5 animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/20 to-primary-500/10 flex items-center justify-center border border-primary-500/10">
                                        <Truck size={22} className="text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{v.name}</h3>
                                        <p className="text-xs text-dark-400">{v.vehicleId} · {v.licensePlate}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-md border capitalize ${getStatusBadge(v.status)}`}>
                                    {v.status}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="space-y-2.5 mb-4">
                                <div className="flex items-center gap-2 text-sm text-dark-300">
                                    <Thermometer size={14} className={getTemperatureColor(v.lastTemperature?.value)} />
                                    <span>
                                        Chamber: <span className={`font-semibold ${getTemperatureColor(v.lastTemperature?.value)}`}>
                                            {v.lastTemperature?.value?.toFixed(1)}°C
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-dark-300">
                                    <MapPin size={14} className="text-dark-500" />
                                    <span>
                                        {v.lastLocation?.lat?.toFixed(4)}, {v.lastLocation?.lng?.toFixed(4)}
                                    </span>
                                </div>
                                {v.driverName && (
                                    <div className="flex items-center gap-2 text-sm text-dark-300">
                                        <CheckCircle size={14} className="text-dark-500" />
                                        <span>{v.driverName} · {v.driverPhone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-dark-400">
                                    <Clock size={14} />
                                    <span className="text-xs">IoT: {v.iotDeviceId}</span>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-dark-700/30">
                                <button
                                    onClick={() => openForm(v)}
                                    className="flex-1 btn-secondary text-xs justify-center py-2"
                                >
                                    <Pencil size={13} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(v.vehicleId)}
                                    className="btn-danger text-xs py-2 px-3"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Truck size={48} className="mx-auto mb-3 text-dark-600" />
                        <p className="text-dark-400 text-lg">No vehicles found</p>
                        <p className="text-dark-500 text-sm mt-1">Try adjusting your search or add a new vehicle</p>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-right">
                        <div className="flex items-center justify-between p-5 border-b border-dark-700/30">
                            <h2 className="text-lg font-bold text-white">
                                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
                            </h2>
                            <button
                                onClick={closeForm}
                                className="p-1.5 rounded-lg hover:bg-dark-700/60 text-dark-400 hover:text-dark-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Vehicle ID</label>
                                    <input
                                        id="form-vehicleId"
                                        className="input-field text-sm"
                                        value={form.vehicleId}
                                        onChange={(e) => setForm({ ...form, vehicleId: e.target.value.toUpperCase() })}
                                        placeholder="TRK-007"
                                        required
                                        disabled={!!editingId}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Status</label>
                                    <select
                                        id="form-status"
                                        className="input-field text-sm"
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-dark-400 mb-1.5 font-medium">Vehicle Name</label>
                                <input
                                    id="form-name"
                                    className="input-field text-sm"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Arctic Express 7"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">License Plate</label>
                                    <input
                                        id="form-licensePlate"
                                        className="input-field text-sm"
                                        value={form.licensePlate}
                                        onChange={(e) => setForm({ ...form, licensePlate: e.target.value.toUpperCase() })}
                                        placeholder="KL-07-XX-1234"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">IoT Device ID</label>
                                    <input
                                        id="form-iotDeviceId"
                                        className="input-field text-sm"
                                        value={form.iotDeviceId}
                                        onChange={(e) => setForm({ ...form, iotDeviceId: e.target.value })}
                                        placeholder="IOT-DEV-007"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Driver Name</label>
                                    <input
                                        id="form-driverName"
                                        className="input-field text-sm"
                                        value={form.driverName}
                                        onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                                        placeholder="Driver name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Driver Phone</label>
                                    <input
                                        id="form-driverPhone"
                                        className="input-field text-sm"
                                        value={form.driverPhone}
                                        onChange={(e) => setForm({ ...form, driverPhone: e.target.value })}
                                        placeholder="+91 xxxxx xxxxx"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="flex-1 btn-secondary justify-center">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center">
                                    <Save size={16} />
                                    {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
