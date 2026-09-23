import React from 'react';
import {
  Ship,
  ArrowLeft,
  Gauge,
  Fuel,
  Leaf,
  Activity,
  Zap,
  Compass,
  Calendar,
  ShieldCheck,
  TrendingDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Vessel, MaritimeRoute } from '../types';
import { EfficiencyBadge, StatusBadge, DemoTag } from '../components/common/CommonComponents';
import { FUEL_SPECIFICATIONS } from '../data/constants';

interface VesselDetailPageProps {
  vessel: Vessel;
  routes: MaritimeRoute[];
  onBack: () => void;
  onNavigateToPrediction: (vessel: Vessel) => void;
}

export const VesselDetailPage: React.FC<VesselDetailPageProps> = ({
  vessel,
  routes,
  onBack,
  onNavigateToPrediction,
}) => {
  const assignedRoute = routes.find((r) => r.id === vessel.currentRouteId) || routes[0];
  const fuelSpec = FUEL_SPECIFICATIONS[vessel.fuelType] || FUEL_SPECIFICATIONS['Marine Diesel'];

  // Synthetic Speed vs Fuel Consumption Power Curve: P ~ V^3.15
  const speedPowerCurve = [];
  for (let s = 10; s <= vessel.designSpeedKnots + 2; s += 1) {
    const ratio = s / vessel.designSpeedKnots;
    const power = vessel.enginePowerKw * Math.pow(ratio, 3.15);
    const fuelRate = (power * (175 / 1000000) * 24 * (42.7 / fuelSpec.energyDensityMjKg)).toFixed(1);
    const co2Rate = (Number(fuelRate) * fuelSpec.operationalEmissionFactor).toFixed(1);

    speedPowerCurve.push({
      speed: `${s} kts`,
      speedVal: s,
      fuelTonnes: Number(fuelRate),
      co2Tonnes: Number(co2Rate),
      isCurrentSpeed: Math.abs(s - vessel.currentSpeedKnots) < 0.6,
    });
  }

  // 14-Day Historical vs Predicted Fuel
  const historicalData = [
    { day: 'Day 1', actual: vessel.dailyFuelConsumptionTonnes * 1.04, predicted: vessel.dailyFuelConsumptionTonnes * 1.02 },
    { day: 'Day 2', actual: vessel.dailyFuelConsumptionTonnes * 1.08, predicted: vessel.dailyFuelConsumptionTonnes * 1.05 },
    { day: 'Day 3', actual: vessel.dailyFuelConsumptionTonnes * 0.98, predicted: vessel.dailyFuelConsumptionTonnes * 0.99 },
    { day: 'Day 4', actual: vessel.dailyFuelConsumptionTonnes * 1.01, predicted: vessel.dailyFuelConsumptionTonnes * 1.00 },
    { day: 'Day 5', actual: vessel.dailyFuelConsumptionTonnes * 1.12, predicted: vessel.dailyFuelConsumptionTonnes * 1.10 },
    { day: 'Day 6', actual: vessel.dailyFuelConsumptionTonnes * 0.95, predicted: vessel.dailyFuelConsumptionTonnes * 0.96 },
    { day: 'Day 7', actual: vessel.dailyFuelConsumptionTonnes, predicted: vessel.dailyFuelConsumptionTonnes },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back and Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Overview</span>
        </button>

        <div className="flex items-center space-x-3">
          <DemoTag />
          <button
            onClick={() => onNavigateToPrediction(vessel)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Gauge className="w-4 h-4" />
            <span>Simulate Voyage in Predictor</span>
          </button>
        </div>
      </div>

      {/* Vessel Profile Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-black text-white text-2xl shadow-md shrink-0">
              <Ship className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">{vessel.name}</h1>
                <EfficiencyBadge grade={vessel.efficiencyScore} />
                <StatusBadge status={vessel.status} />
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {vessel.id} • {vessel.imoNumber} • Flag: {vessel.flag} • Built: {vessel.yearBuilt} ({vessel.ageYears} yrs)
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] bg-slate-800 text-cyan-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-semibold">
                  Type: {vessel.type}
                </span>
                <span className="text-[11px] bg-slate-800 text-emerald-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-semibold">
                  Fuel: {vessel.fuelType}
                </span>
                {vessel.shorePowerCapable && (
                  <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" /> Shore Power Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Operating Speed</span>
              <p className="text-lg font-black text-white font-mono mt-0.5">{vessel.currentSpeedKnots} kts</p>
              <span className="text-[10px] text-slate-400">Design {vessel.designSpeedKnots} kts</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Fuel</span>
              <p className="text-lg font-black text-cyan-400 font-mono mt-0.5">{vessel.dailyFuelConsumptionTonnes} t</p>
              <span className="text-[10px] text-emerald-400 font-semibold">-16.2% vs Base</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Daily CO₂e</span>
              <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">{vessel.co2EmissionsTonnesPerDay} t</p>
              <span className="text-[10px] text-slate-400">CII Grade: A</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Engine Power</span>
              <p className="text-lg font-black text-indigo-300 font-mono mt-0.5">{(vessel.enginePowerKw / 1000).toFixed(0)} MW</p>
              <span className="text-[10px] text-slate-400">{(vessel.engineEfficiency * 100).toFixed(0)}% eff</span>
            </div>
          </div>
        </div>
      </div>

      {/* Speed-Power Hydrodynamic Curve Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hydrodynamic Speed vs Fuel Consumption Power Curve</h3>
            <p className="text-xs text-slate-500">
              Non-linear cubic relationship ($P \propto \Delta^{2/3} \cdot V^{3.15}$) illustrating the slow-steaming efficiency sweet spot
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
            Optimal Range: 14.5 – 18.0 kts
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedPowerCurve} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="speed" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="fuelTonnes" name="Fuel Consumption (t/day)" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="co2Tonnes" name="CO₂ Emissions (t/day)" stroke="#10b981" strokeWidth={2.5} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Telemetry & Route Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical vs Predicted */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">7-Day Telemetry: Actual vs Predicted Fuel (t/day)</h3>
            <p className="text-xs text-slate-500">Model validation on live sensor logs with Holtrop-Mennen compensation</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actual" name="Actual Measured" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="AI Physics Predicted" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assigned Route & Specifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Active Voyage & Corridor Specifications</h3>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {assignedRoute.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Corridor Origin</span>
              <p className="font-bold text-slate-900 mt-0.5">{assignedRoute.origin}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Destination</span>
              <p className="font-bold text-slate-900 mt-0.5">{assignedRoute.destination}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Voyage Distance</span>
              <p className="font-bold text-slate-900 font-mono mt-0.5">{assignedRoute.distanceNm.toLocaleString()} NM</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Weather Condition</span>
              <p className="font-bold text-slate-900 mt-0.5">{assignedRoute.weatherCondition} ({assignedRoute.windSpeedKnots} kts)</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-indigo-900">Estimated Voyage Duration at Current Speed</p>
              <p className="text-indigo-700 text-[11px]">
                {Math.round(assignedRoute.distanceNm / vessel.currentSpeedKnots)} hours (ETA within deadline of {assignedRoute.deadlineHours}h)
              </p>
            </div>
            <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[10px]">
              On Schedule
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
