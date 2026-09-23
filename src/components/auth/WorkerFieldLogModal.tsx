import React, { useState } from 'react';
import {
  Wrench,
  Fuel,
  Zap,
  Gauge,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Send,
  Ship,
  FileText,
  Clock,
  Check,
} from 'lucide-react';
import { Vessel, User, WorkerFieldLog } from '../../types';

interface WorkerFieldLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  vessels: Vessel[];
  currentUser: User;
  onSubmitLog: (log: WorkerFieldLog, updatedVessel?: Vessel) => void;
}

export const WorkerFieldLogModal: React.FC<WorkerFieldLogModalProps> = ({
  isOpen,
  onClose,
  vessels,
  currentUser,
  onSubmitLog,
}) => {
  const [selectedVesselId, setSelectedVesselId] = useState<string>(
    currentUser.assignedVesselId || (vessels[0]?.id ?? 'VSL-101')
  );
  const [category, setCategory] = useState<
    'Bunker Reading' | 'Shore Power Hookup' | 'Engine Telemetry' | 'Hull & Draft Check' | 'Maintenance Safety'
  >('Bunker Reading');
  const [fuelMeterTonnes, setFuelMeterTonnes] = useState<number>(68.5);
  const [engineRpm, setEngineRpm] = useState<number>(88);
  const [powerKw, setPowerKw] = useState<number>(54000);
  const [exhaustTempC, setExhaustTempC] = useState<number>(385);
  const [draftMeters, setDraftMeters] = useState<number>(14.5);
  const [shorePowerConnected, setShorePowerConnected] = useState<boolean>(true);
  const [kwDelivered, setKwDelivered] = useState<number>(4500);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: WorkerFieldLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      workerName: currentUser.name,
      workerRole: currentUser.rank || 'Field Marine Specialist',
      workerId: currentUser.id,
      vesselId: currentVessel.id,
      vesselName: currentVessel.name,
      category,
      fuelMeterTonnes: category === 'Bunker Reading' ? Number(fuelMeterTonnes) : undefined,
      engineRpm: category === 'Engine Telemetry' ? Number(engineRpm) : undefined,
      powerKw: category === 'Engine Telemetry' ? Number(powerKw) : undefined,
      exhaustTempC: category === 'Engine Telemetry' ? Number(exhaustTempC) : undefined,
      draftMeters: category === 'Hull & Draft Check' ? Number(draftMeters) : undefined,
      shorePowerConnected: category === 'Shore Power Hookup' ? shorePowerConnected : undefined,
      kwDelivered: category === 'Shore Power Hookup' ? Number(kwDelivered) : undefined,
      notes: notes.trim() || `Operational log submitted by ${currentUser.name} for ${currentVessel.name}.`,
      status: 'Verified',
    };

    // Update vessel fuel burn or shore power if applicable
    let updatedVessel: Vessel | undefined = undefined;
    if (category === 'Bunker Reading' && fuelMeterTonnes > 0) {
      updatedVessel = {
        ...currentVessel,
        dailyFuelConsumptionTonnes: Number(fuelMeterTonnes),
        co2EmissionsTonnesPerDay: Number((fuelMeterTonnes * 3.114).toFixed(1)),
      };
    } else if (category === 'Shore Power Hookup') {
      updatedVessel = {
        ...currentVessel,
        shorePowerCapable: true,
      };
    }

    onSubmitLog(newLog, updatedVessel);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-teal-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Worker Field Telemetry & Log Entry
                </h3>
                <p className="text-xs text-teal-200">
                  Logged by: {currentUser.name} • {currentUser.badgeNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-teal-200 hover:text-white p-1.5 rounded-lg hover:bg-teal-800 transition-colors text-xs font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Field Telemetry Transmitted!</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Log verified and dispatched to Fleet Operations. Telemetry values synced to {currentVessel.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Vessel Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Commercial Vessel
              </label>
              <div className="relative">
                <Ship className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <select
                  value={selectedVesselId}
                  onChange={(e) => setSelectedVesselId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                >
                  {vessels.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.id} • {v.type} • {v.fuelType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Log Operational Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Bunker Reading', icon: Fuel, label: 'Bunker Meter' },
                  { id: 'Shore Power Hookup', icon: Zap, label: 'Shore Power' },
                  { id: 'Engine Telemetry', icon: Gauge, label: 'Engine RPM' },
                  { id: 'Hull & Draft Check', icon: Activity, label: 'Hull Draft' },
                  { id: 'Maintenance Safety', icon: AlertTriangle, label: 'Safety Check' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      category === item.id
                        ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Metric Inputs based on Category */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              {category === 'Bunker Reading' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Daily Mass Flow Meter Fuel (Tonnes)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Current: {currentVessel.dailyFuelConsumptionTonnes} t
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="300"
                    value={fuelMeterTonnes}
                    onChange={(e) => setFuelMeterTonnes(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Calculated daily CO₂e: {(fuelMeterTonnes * 3.114).toFixed(1)} tonnes
                  </p>
                </div>
              )}

              {category === 'Shore Power Hookup' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Cold Ironing Cable Connection
                    </span>
                    <button
                      type="button"
                      onClick={() => setShorePowerConnected(!shorePowerConnected)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        shorePowerConnected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {shorePowerConnected ? 'Connected & Synchronized' : 'Disconnected'}
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Power Grid Delivery (kW)
                    </label>
                    <input
                      type="number"
                      value={kwDelivered}
                      onChange={(e) => setKwDelivered(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {category === 'Engine Telemetry' && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Engine RPM
                    </label>
                    <input
                      type="number"
                      value={engineRpm}
                      onChange={(e) => setEngineRpm(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Power (kW)
                    </label>
                    <input
                      type="number"
                      value={powerKw}
                      onChange={(e) => setPowerKw(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Exhaust (°C)
                    </label>
                    <input
                      type="number"
                      value={exhaustTempC}
                      onChange={(e) => setExhaustTempC(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              )}

              {category === 'Hull & Draft Check' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mean Draft Reading (Meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={draftMeters}
                    onChange={(e) => setDraftMeters(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              {category === 'Maintenance Safety' && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  Submitting a safety or maintenance notice flags a High-Priority notification for the
                  Chief Marine Officer and updates the vessel status queue.
                </div>
              )}
            </div>

            {/* Field Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Engineering Observations & Inspection Remarks
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log valve pressure, auxiliary generator status, sea state vibration observations..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Submit to Fleet Registry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
