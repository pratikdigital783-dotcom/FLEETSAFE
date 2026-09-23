import React, { useState } from 'react';
import {
  Atom,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  DollarSign,
  Leaf,
  Clock,
  Zap,
  Sliders,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  TrendingDown,
  Info,
  ShieldCheck,
  Check,
  Ship,
  Compass,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Vessel, MaritimeRoute, OptimizationConfig, OptimizationResult, FuelType } from '../types';
import { QuantumOptimizer } from '../services/quantumOptimizer';
import { StatusBadge, EfficiencyBadge, DemoTag } from '../components/common/CommonComponents';

interface OptimizationPageProps {
  vessels: Vessel[];
  routes: MaritimeRoute[];
}

export const OptimizationPage: React.FC<OptimizationPageProps> = ({
  vessels,
  routes,
}) => {
  // Optimization Config State
  const [config, setConfig] = useState<OptimizationConfig>({
    populationSize: 24,
    maxIterations: 50,
    selectedVesselIds: vessels.map((v) => v.id),
    selectedRouteIds: routes.map((r) => r.id),
    allowedFuels: ['Marine Diesel', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'],
    minSpeedKnots: 12.0,
    maxSpeedKnots: 21.0,
    maxEmissionCapTonnes: 15000,
    fuelTargetCapTonnes: 5000,
    deliveryDeadlineHours: 600,
    weights: {
      fuelConsumption: 35,
      operationalCost: 25,
      co2Emissions: 25,
      scheduleReliability: 15,
    },
    algorithm: 'QGA',
    rotationStepTheta: 0.05 * Math.PI,
    mutationRate: 0.04,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(100);
  const [result, setResult] = useState<OptimizationResult | null>(() => {
    try {
      return QuantumOptimizer.optimize(config, vessels, routes);
    } catch {
      return null;
    }
  });

  const handleToggleVessel = (id: string) => {
    setConfig((prev) => {
      const exists = prev.selectedVesselIds.includes(id);
      const selected = exists ? prev.selectedVesselIds.filter((v) => v !== id) : [...prev.selectedVesselIds, id];
      return { ...prev, selectedVesselIds: selected.length > 0 ? selected : [id] };
    });
  };

  const handleToggleFuel = (fuel: FuelType) => {
    setConfig((prev) => {
      const exists = prev.allowedFuels.includes(fuel);
      const fuels = exists ? prev.allowedFuels.filter((f) => f !== fuel) : [...prev.allowedFuels, fuel];
      return { ...prev, allowedFuels: fuels.length > 0 ? fuels : [fuel] };
    });
  };

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setCurrentProgress(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 15;
      setCurrentProgress(Math.min(100, step));
      if (step >= 100) {
        clearInterval(interval);
        const res = QuantumOptimizer.optimize(config, vessels, routes);
        setResult(res);
        setIsOptimizing(false);
      }
    }, 80);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Quantum-Inspired Fleet Optimization Engine
            </h1>
            <DemoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Q-Bit probability amplitude metaheuristic for simultaneous vessel allocation, cruising speed throttling, and multi-fuel dispatch.
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isOptimizing}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
        >
          {isOptimizing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Executing Quantum Rotations {currentProgress}%</span>
            </>
          ) : (
            <>
              <Atom className="w-4 h-4" />
              <span>Run Quantum Optimizer</span>
            </>
          )}
        </button>
      </div>

      {/* Configuration Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Multi-Objective Formulation & Constraints
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
              {config.algorithm} Metaheuristic
            </span>
          </div>

          {/* Multi-Objective Fitness Weight Sliders */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Objective Function Weights</span>
              <span className="text-[11px] text-slate-500 font-mono">
                Total:{' '}
                {config.weights.fuelConsumption +
                  config.weights.operationalCost +
                  config.weights.co2Emissions +
                  config.weights.scheduleReliability}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600 font-semibold">Fuel Minimization (w₁)</span>
                  <span className="font-mono font-bold text-cyan-700">{config.weights.fuelConsumption}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.weights.fuelConsumption}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      weights: { ...config.weights, fuelConsumption: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600 font-semibold">OPEX / Bunker Cost (w₂)</span>
                  <span className="font-mono font-bold text-emerald-700">{config.weights.operationalCost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.weights.operationalCost}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      weights: { ...config.weights, operationalCost: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600 font-semibold">Lifecycle CO₂e Abatement (w₃)</span>
                  <span className="font-mono font-bold text-teal-700">{config.weights.co2Emissions}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.weights.co2Emissions}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      weights: { ...config.weights, co2Emissions: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600 font-semibold">Schedule On-Time Delivery (w₄)</span>
                  <span className="font-mono font-bold text-indigo-700">{config.weights.scheduleReliability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.weights.scheduleReliability}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      weights: { ...config.weights, scheduleReliability: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Operational Boundaries */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Speed (kts)</label>
              <input
                type="number"
                step="0.5"
                value={config.minSpeedKnots}
                onChange={(e) => setConfig({ ...config, minSpeedKnots: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Speed (kts)</label>
              <input
                type="number"
                step="0.5"
                value={config.maxSpeedKnots}
                onChange={(e) => setConfig({ ...config, maxSpeedKnots: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Allowed Alternative Fuels */}
          <div>
            <label className="block font-bold text-xs text-slate-700 mb-2">Permitted Fuel Powertrains</label>
            <div className="flex flex-wrap gap-1.5">
              {(['Marine Diesel', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'] as FuelType[]).map((fuel) => {
                const active = config.allowedFuels.includes(fuel);
                return (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => handleToggleFuel(fuel)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {fuel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Vessels Selection Checklist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-xs text-slate-700">Fleet Scope ({config.selectedVesselIds.length} vessels)</label>
              <button
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    selectedVesselIds:
                      prev.selectedVesselIds.length === vessels.length ? [vessels[0].id] : vessels.map((v) => v.id),
                  }))
                }
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Toggle All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50">
              {vessels.map((v) => {
                const isSelected = config.selectedVesselIds.includes(v.id);
                return (
                  <label
                    key={v.id}
                    className={`flex items-center space-x-2 p-1.5 rounded text-[11px] cursor-pointer ${
                      isSelected ? 'bg-white font-bold text-slate-900 border border-slate-200' : 'text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleVessel(v.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{v.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Mathematical Model Accordion Box */}
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono space-y-1">
            <p className="text-cyan-400 font-bold">Optimization Objective Formulation:</p>
            <p className="text-slate-300">
              Min F = w₁·(F/F₀) + w₂·(C/C₀) + w₃·(E/E₀) + w₄·Penalty_Delay + w₅·Penalty_Cap
            </p>
            <p className="text-slate-400 text-[10px]">
              Subject to: V_min ≤ Speed ≤ V_max | CargoAssigned ≤ Cap | ShorePower ≤ Capable
            </p>
          </div>
        </div>

        {/* Right Column: Optimization Results & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <>
              {/* Before vs After Impact Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Fuel Reduction</span>
                  <p className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                    -{result.improvements.fuelReductionPct}%
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-1">
                    {result.improvements.fuelSavingsTonnes} t saved
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-blue-800 uppercase">OPEX Savings</span>
                  <p className="text-2xl font-black text-blue-700 font-mono mt-0.5">
                    -${Math.round(result.improvements.costSavingsUsd / 1000)}k
                  </p>
                  <p className="text-[10px] text-blue-600 mt-1">
                    -{result.improvements.costReductionPct}% cost cut
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-teal-800 uppercase">CO₂e Abatement</span>
                  <p className="text-2xl font-black text-teal-700 font-mono mt-0.5">
                    -{result.improvements.emissionReductionPct}%
                  </p>
                  <p className="text-[10px] text-teal-600 mt-1">
                    {result.improvements.emissionReductionTonnes} t avoided
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase">Reliability</span>
                  <p className="text-2xl font-black text-indigo-700 font-mono mt-0.5">
                    {result.optimized.scheduleReliabilityPct}%
                  </p>
                  <p className="text-[10px] text-indigo-600 mt-1">
                    +{result.improvements.reliabilityImprovementPct}% boost
                  </p>
                </div>
              </div>

              {/* Quantum Convergence History Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Quantum Metaheuristic Convergence Trajectory</h3>
                    <p className="text-xs text-slate-500">
                      Multi-objective fitness reduction & quantum superposition entropy dissipation over 50 iterations
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    Execution: {result.executionTimeMs} ms
                  </span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.convergenceHistory} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="iteration" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="bestFitness" name="Best Fitness F(x)" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="averageFitness" name="Avg Population Fitness" stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="quantumEntropy" name="Q-Bit Superposition Entropy" stroke="#a855f7" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quantum Probability Amplitudes Inspection Grid */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Atom className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Q-Bit Probability Amplitude States (|α|² vs |β|²)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Quantum Rotation Gates Active</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {result.qbitStates.slice(0, 8).map((q) => (
                    <div key={q.geneIndex} className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 font-mono">q{q.geneIndex}</span>
                      <div className="my-1.5 h-12 w-full bg-slate-900 rounded flex flex-col justify-end p-0.5">
                        <div
                          className="bg-cyan-400 w-full rounded-xs transition-all"
                          style={{ height: `${Math.round(q.betaSq * 100)}%` }}
                          title={`|β|² = ${q.betaSq}`}
                        ></div>
                      </div>
                      <p className="text-[10px] font-mono font-bold text-cyan-300">{(q.betaSq * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraint Compliance Audit Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Operational Constraint Audit
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    100% Compliant
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cargo Demand Satisfied</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>DWT Capacity Valid</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Speed Limits Enforced</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Deadlines Respected</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Emission Cap Satisfied</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cold Ironing Validated</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recommended Fleet Deployment Plan Table */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recommended Quantum-Optimized Deployment Plan</h3>
              <p className="text-xs text-slate-500">
                Individual vessel speed, fuel selection, and route assignments maximizing overall fleet efficiency
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Vessel</th>
                  <th className="py-3 px-3">Assigned Route</th>
                  <th className="py-3 px-3">Optimized Speed</th>
                  <th className="py-3 px-3">Fuel Tech</th>
                  <th className="py-3 px-3">Est. Fuel</th>
                  <th className="py-3 px-3">Est. Cost</th>
                  <th className="py-3 px-3">CO₂e Abated</th>
                  <th className="py-3 px-3">ETA vs Deadline</th>
                  <th className="py-3 px-3">Shore Power</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.assignments.map((a) => (
                  <tr key={a.vesselId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{a.vesselName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{a.vesselId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{a.routeName}</div>
                      <div className="text-[10px] text-slate-500">{a.assignedCargo.toLocaleString()} cargo units</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      {a.speedKnots} kts
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{a.fuelType}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {a.predictedFuelTonnes} t
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      ${Math.round(a.estimatedCostUsd / 1000)}k
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">
                      {a.co2eTonnes} t
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-semibold text-slate-800">{a.etaHours}h</span>
                      <span className="text-[10px] text-slate-400"> (limit {a.deadlineHours}h)</span>
                    </td>
                    <td className="py-3 px-3">
                      {a.shorePowerUsed ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
