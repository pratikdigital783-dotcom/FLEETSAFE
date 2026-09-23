import React, { useState } from 'react';
import {
  Ship,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Gauge,
  Fuel,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Edit2,
  Trash2,
  Eye,
  X,
  Shield,
  Wrench,
  Lock,
} from 'lucide-react';
import { Vessel, VesselType, FuelType, VesselStatus, EfficiencyGrade, User } from '../types';
import { EfficiencyBadge, StatusBadge, DemoTag } from '../components/common/CommonComponents';
import { FUEL_SPECIFICATIONS } from '../data/constants';

interface FleetPageProps {
  vessels: Vessel[];
  currentUser?: User | null;
  onAddVessel: (v: Vessel) => void;
  onUpdateVessel: (v: Vessel) => void;
  onDeleteVessel: (id: string) => void;
  onSelectVesselDetail: (v: Vessel) => void;
  onOpenWorkerLog?: () => void;
}

export const FleetPage: React.FC<FleetPageProps> = ({
  vessels,
  currentUser,
  onAddVessel,
  onUpdateVessel,
  onDeleteVessel,
  onSelectVesselDetail,
  onOpenWorkerLog,
}) => {
  const isOfficer = currentUser?.role === 'officer';
  const isWorker = currentUser?.role === 'worker';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'fuel' | 'efficiency' | 'capacity'>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Container Ship' as VesselType,
    capacity: 15000,
    capacityUnit: 'TEU',
    enginePowerKw: 60000,
    ageYears: 3,
    fuelType: 'LNG' as FuelType,
    currentSpeedKnots: 18.0,
    designSpeedKnots: 22.0,
    currentRouteId: 'R-01',
    status: 'Active' as VesselStatus,
    shorePowerCapable: true,
    engineEfficiency: 0.48,
    flag: 'Singapore',
    imoNumber: 'IMO 9887766',
  });

  const handleOpenAdd = () => {
    setEditingVessel(null);
    setFormData({
      name: '',
      type: 'Container Ship',
      capacity: 15000,
      capacityUnit: 'TEU',
      enginePowerKw: 60000,
      ageYears: 3,
      fuelType: 'LNG',
      currentSpeedKnots: 18.0,
      designSpeedKnots: 22.0,
      currentRouteId: 'R-01',
      status: 'Active',
      shorePowerCapable: true,
      engineEfficiency: 0.48,
      flag: 'Singapore',
      imoNumber: `IMO ${Math.floor(1000000 + Math.random() * 9000000)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vessel: Vessel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVessel(vessel);
    setFormData({
      name: vessel.name,
      type: vessel.type,
      capacity: vessel.capacity,
      capacityUnit: vessel.capacityUnit,
      enginePowerKw: vessel.enginePowerKw,
      ageYears: vessel.ageYears,
      fuelType: vessel.fuelType,
      currentSpeedKnots: vessel.currentSpeedKnots,
      designSpeedKnots: vessel.designSpeedKnots,
      currentRouteId: vessel.currentRouteId,
      status: vessel.status,
      shorePowerCapable: vessel.shorePowerCapable,
      engineEfficiency: vessel.engineEfficiency,
      flag: vessel.flag,
      imoNumber: vessel.imoNumber,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Approximate consumption for newly created/edited vessel
    const speedRatio = formData.currentSpeedKnots / formData.designSpeedKnots;
    const approxDailyFuel = Number(
      (formData.enginePowerKw * Math.pow(speedRatio, 3.1) * (175 / 1000000) * 24 * (42.7 / (FUEL_SPECIFICATIONS[formData.fuelType]?.energyDensityMjKg || 42.7))).toFixed(1)
    );
    const approxCo2 = Number((approxDailyFuel * (FUEL_SPECIFICATIONS[formData.fuelType]?.operationalEmissionFactor || 3.114)).toFixed(1));

    if (editingVessel) {
      const updated: Vessel = {
        ...editingVessel,
        ...formData,
        dailyFuelConsumptionTonnes: approxDailyFuel,
        co2EmissionsTonnesPerDay: approxCo2,
      };
      onUpdateVessel(updated);
    } else {
      const newVessel: Vessel = {
        id: `FS-${100 + vessels.length + 1}`,
        ...formData,
        dailyFuelConsumptionTonnes: approxDailyFuel,
        baselineDailyFuelTonnes: Number((approxDailyFuel * 1.15).toFixed(1)),
        co2EmissionsTonnesPerDay: approxCo2,
        efficiencyScore: approxDailyFuel < 40 ? 'A+' : approxDailyFuel < 80 ? 'A' : 'B',
        efficiencyPercentage: 90,
        coordinates: [1.29, 103.85],
        yearBuilt: new Date().getFullYear() - formData.ageYears,
      };
      onAddVessel(newVessel);
    }

    setIsModalOpen(false);
  };

  // Filtering and Sorting
  const filteredVessels = vessels
    .filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.flag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || v.type === selectedType;
      const matchesFuel = selectedFuel === 'All' || v.fuelType === selectedFuel;
      const matchesStatus = selectedStatus === 'All' || v.status === selectedStatus;
      return matchesSearch && matchesType && matchesFuel && matchesStatus;
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === 'name') comp = a.name.localeCompare(b.name);
      else if (sortBy === 'fuel') comp = a.dailyFuelConsumptionTonnes - b.dailyFuelConsumptionTonnes;
      else if (sortBy === 'capacity') comp = a.capacity - b.capacity;
      else if (sortBy === 'efficiency') comp = a.efficiencyPercentage - b.efficiencyPercentage;
      return sortOrder === 'asc' ? comp : -comp;
    });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fleet Vessel Registry</h1>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider font-mono">
              {vessels.length} Active Assets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hydrodynamic vessel profiles, powertrain configurations, and fuel efficiency telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isOfficer ? (
            <button
              onClick={handleOpenAdd}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Vessel
            </button>
          ) : isWorker ? (
            <button
              onClick={onOpenWorkerLog}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Wrench className="w-4 h-4" /> Log Field Telemetry
            </button>
          ) : (
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Read-Only View
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by vessel name, IMO or ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="All">All Vessel Types</option>
            <option value="Container Ship">Container Ship</option>
            <option value="Bulk Carrier">Bulk Carrier</option>
            <option value="Tanker">Tanker</option>
            <option value="Ro-Ro">Ro-Ro</option>
            <option value="General Cargo">General Cargo</option>
          </select>

          {/* Fuel Filter */}
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="All">All Fuel Types</option>
            <option value="Marine Diesel">Marine Diesel</option>
            <option value="LNG">LNG</option>
            <option value="Methanol">Methanol</option>
            <option value="Hydrogen">Hydrogen</option>
            <option value="Ammonia">Ammonia</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Port">In Port</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Anchored">Anchored</option>
          </select>

          {/* Sort Control */}
          <div className="flex items-center space-x-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="efficiency">Sort by Efficiency</option>
              <option value="fuel">Sort by Daily Fuel</option>
              <option value="capacity">Sort by Capacity</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Toggle Sort Direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Vessels Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col space-y-2 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800">Operational Vessels</h3>
            <p className="text-xs text-slate-400">Showing {filteredVessels.length} of {vessels.length} recorded commercial vessels</p>
          </div>
          <span className="text-xs text-slate-400">Click any row to view telemetry & speed-power curves</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase text-slate-400 font-bold border-b border-slate-50">
              <tr>
                <th className="pb-3">Vessel Details</th>
                <th className="pb-3">Type & Capacity</th>
                <th className="pb-3">Powertrain / Fuel</th>
                <th className="pb-3 text-right">Speed</th>
                <th className="pb-3 text-right">Daily Fuel</th>
                <th className="pb-3 text-right">CO₂e Rate</th>
                <th className="pb-3 text-center">Efficiency Score</th>
                <th className="pb-3 text-center">Shore Power</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredVessels.map((vessel) => (
                <tr
                  key={vessel.id}
                  onClick={() => onSelectVesselDetail(vessel)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                      <Ship className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{vessel.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {vessel.id} • {vessel.imoNumber} • {vessel.flag}
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-700 text-xs">
                    <div className="font-medium text-slate-800">{vessel.type}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {vessel.capacity.toLocaleString()} {vessel.capacityUnit}
                    </div>
                  </td>
                  <td className="py-3.5 text-xs">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {vessel.fuelType}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {(vessel.enginePowerKw / 1000).toFixed(0)} MW ({(vessel.engineEfficiency * 100).toFixed(0)}% eff)
                    </div>
                  </td>
                  <td className="py-3.5 text-right font-mono text-xs font-semibold text-slate-900">
                    {vessel.currentSpeedKnots} kts
                    <div className="text-[10px] font-normal text-slate-400">Design {vessel.designSpeedKnots} kts</div>
                  </td>
                  <td className="py-3.5 text-right font-mono text-xs font-bold text-slate-900">
                    {vessel.dailyFuelConsumptionTonnes} t
                    <div className="text-[10px] font-normal text-slate-400">Base {vessel.baselineDailyFuelTonnes} t</div>
                  </td>
                  <td className="py-3.5 text-right font-mono text-xs text-slate-600">
                    {vessel.co2EmissionsTonnesPerDay} t
                  </td>
                  <td className="py-3.5 text-center">
                    <div className="inline-flex items-center space-x-1.5">
                      <EfficiencyBadge grade={vessel.efficiencyScore} />
                      <span className="text-[11px] font-mono text-slate-500">{vessel.efficiencyPercentage}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-center">
                    {vessel.shorePowerCapable ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                        <Zap className="w-3 h-3 text-emerald-600" /> Equipped
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3.5 text-center">
                    <StatusBadge status={vessel.status} />
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectVesselDetail(vessel)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Telemetry & Digital Twin"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isOfficer ? (
                        <>
                          <button
                            onClick={(e) => handleOpenEdit(vessel, e)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Vessel Configuration"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete vessel ${vessel.name}?`)) onDeleteVessel(vessel.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Vessel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenWorkerLog) onOpenWorkerLog();
                          }}
                          className="p-1.5 text-teal-600 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
                          title="Log Field Telemetry for this Vessel"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vessel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ship className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">
                  {editingVessel ? `Edit Vessel: ${editingVessel.name}` : 'Register New Fleet Vessel'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vessel Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pacific Horizon"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vessel Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as VesselType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Container Ship">Container Ship</option>
                    <option value="Bulk Carrier">Bulk Carrier</option>
                    <option value="Tanker">Tanker</option>
                    <option value="Ro-Ro">Ro-Ro</option>
                    <option value="General Cargo">General Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fuel Technology</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Marine Diesel">Marine Diesel</option>
                    <option value="LNG">LNG</option>
                    <option value="Methanol">Methanol</option>
                    <option value="Hydrogen">Hydrogen</option>
                    <option value="Ammonia">Ammonia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity Unit</label>
                  <input
                    type="text"
                    value={formData.capacityUnit}
                    onChange={(e) => setFormData({ ...formData, capacityUnit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Engine Power (kW)</label>
                  <input
                    type="number"
                    value={formData.enginePowerKw}
                    onChange={(e) => setFormData({ ...formData, enginePowerKw: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={formData.ageYears}
                    onChange={(e) => setFormData({ ...formData, ageYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operating Speed (kts)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.currentSpeedKnots}
                    onChange={(e) => setFormData({ ...formData, currentSpeedKnots: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Design Speed (kts)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.designSpeedKnots}
                    onChange={(e) => setFormData({ ...formData, designSpeedKnots: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="shorePowerCapable"
                  checked={formData.shorePowerCapable}
                  onChange={(e) => setFormData({ ...formData, shorePowerCapable: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="shorePowerCapable" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Equipped with High Voltage Shore Connection (Cold Ironing)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-lg cursor-pointer shadow-xs"
                >
                  {editingVessel ? 'Save Changes' : 'Register Vessel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
