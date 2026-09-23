import React from 'react';
import {
  FileText,
  Wrench,
  Fuel,
  Zap,
  Gauge,
  Activity,
  CheckCircle2,
  Clock,
  User,
  Plus,
} from 'lucide-react';
import { WorkerFieldLog } from '../../types';

interface WorkerLogsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: WorkerFieldLog[];
  onOpenNewLog: () => void;
  canCreateLog: boolean;
}

export const WorkerLogsListModal: React.FC<WorkerLogsListModalProps> = ({
  isOpen,
  onClose,
  logs,
  onOpenNewLog,
  canCreateLog,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Field Telemetry & Bunker Audit Registry
              </h3>
              <p className="text-xs text-slate-400">
                Verified operational field logs transmitted by vessel crew & terminal operators
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canCreateLog && (
              <button
                onClick={() => {
                  onClose();
                  onOpenNewLog();
                }}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Entry
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No field telemetry records logged yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`p-2 rounded-xl border text-xs font-bold ${
                        log.category === 'Bunker Reading'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : log.category === 'Shore Power Hookup'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {log.category === 'Bunker Reading' ? (
                        <Fuel className="w-4 h-4" />
                      ) : log.category === 'Shore Power Hookup' ? (
                        <Zap className="w-4 h-4" />
                      ) : (
                        <Gauge className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{log.vesselName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({log.vesselId})</span>
                        <span className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold font-mono">
                          {log.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-700">{log.workerName}</span>
                        <span>•</span>
                        <span>{log.workerRole}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{log.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>

                {/* Metrics Readout */}
                <div className="flex flex-wrap items-center gap-4 text-xs bg-white p-2.5 rounded-xl border border-slate-200 font-mono">
                  {log.fuelMeterTonnes !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Mass Flow Fuel</span>
                      <span className="font-bold text-slate-900">{log.fuelMeterTonnes} t/day</span>
                    </div>
                  )}
                  {log.kwDelivered !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Grid Power Hookup</span>
                      <span className="font-bold text-emerald-600">{log.kwDelivered} kW</span>
                    </div>
                  )}
                  {log.powerKw !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Engine Output</span>
                      <span className="font-bold text-slate-900">{(log.powerKw / 1000).toFixed(0)} MW</span>
                    </div>
                  )}
                  {log.engineRpm !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Engine RPM</span>
                      <span className="font-bold text-slate-900">{log.engineRpm} RPM</span>
                    </div>
                  )}
                  {log.exhaustTempC !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Exhaust Temp</span>
                      <span className="font-bold text-slate-900">{log.exhaustTempC} °C</span>
                    </div>
                  )}
                  {log.draftMeters !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Draft</span>
                      <span className="font-bold text-slate-900">{log.draftMeters} m</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {log.notes && (
                  <p className="text-xs text-slate-600 italic bg-white/60 p-2 rounded-lg border border-slate-100">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
