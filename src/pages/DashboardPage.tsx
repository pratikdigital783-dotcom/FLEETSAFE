import React, { useState } from 'react';
import {
  Fuel,
  DollarSign,
  Leaf,
  CheckCircle2,
  Atom,
  TrendingDown,
  ArrowUpRight,
  ChevronRight,
  BarChart3,
  Gauge,
  Ship,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Vessel, MaritimeRoute } from '../types';
import { KPICard, StatusBadge, EfficiencyBadge } from '../components/common/CommonComponents';

interface DashboardPageProps {
  vessels: Vessel[];
  routes: MaritimeRoute[];
  onNavigate?: (tab: string) => void;
  onNavigateTo?: (tab: string) => void;
  onSelectVessel?: (v: Vessel) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  vessels,
  routes,
  onNavigate,
  onNavigateTo,
  onSelectVessel,
}) => {
  const navigate = onNavigate || onNavigateTo || (() => {});
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | '90d'>('7d');

  // Aggregated KPIs
  const totalVessels = vessels.length;
  const activeVessels = vessels.filter((v) => v.status === 'Active').length;
  const totalDailyFuel = vessels.reduce((acc, v) => acc + v.dailyFuelConsumptionTonnes, 0);
  const baselineDailyFuel = vessels.reduce((acc, v) => acc + v.baselineDailyFuelTonnes, 0);
  const totalDailyCo2 = vessels.reduce((acc, v) => acc + v.co2EmissionsTonnesPerDay, 0);
  const baselineDailyCo2 = vessels.reduce((acc, v) => acc + v.baselineDailyFuelTonnes * 3.114, 0);
  const totalDailyCost = totalDailyFuel * 680; // approximate avg fuel price
  const baselineDailyCost = baselineDailyFuel * 680;
  const netDailySavings = baselineDailyCost - totalDailyCost;

  const fuelSavingsPct = ((baselineDailyFuel - totalDailyFuel) / baselineDailyFuel) * 100;
  const co2SavingsPct = ((baselineDailyCo2 - totalDailyCo2) / baselineDailyCo2) * 100;

  // Chart 1: Historical Fuel vs Optimized Trend
  const fuelTrendData = [
    { day: 'Day 1', actual: 440, optimized: 360, baseline: 450 },
    { day: 'Day 2', actual: 432, optimized: 355, baseline: 448 },
    { day: 'Day 3', actual: 418, optimized: 348, baseline: 452 },
    { day: 'Day 4', actual: 395, optimized: 342, baseline: 445 },
    { day: 'Day 5', actual: 388, optimized: 338, baseline: 440 },
    { day: 'Day 6', actual: 375, optimized: 330, baseline: 442 },
    { day: 'Day 7', actual: 365, optimized: 324, baseline: 445 },
  ];

  // Chart 2: Fuel Mix Breakdown
  const fuelMixData = [
    { name: 'Marine Diesel', value: vessels.filter((v) => v.fuelType === 'Marine Diesel').length, color: '#64748b' },
    { name: 'LNG', value: vessels.filter((v) => v.fuelType === 'LNG').length, color: '#4f46e5' },
    { name: 'Methanol', value: vessels.filter((v) => v.fuelType === 'Methanol').length, color: '#10b981' },
    { name: 'Hydrogen', value: vessels.filter((v) => v.fuelType === 'Hydrogen').length, color: '#06b6d4' },
  ].filter((f) => f.value > 0);

  // Chart 3: Vessel Efficiency Comparison
  const vesselEfficiencyData = vessels.slice(0, 6).map((v) => ({
    name: v.name.replace('Safe', '').replace('Star', '').trim(),
    actualFuel: v.dailyFuelConsumptionTonnes,
    baselineFuel: v.baselineDailyFuelTonnes,
    co2: v.co2EmissionsTonnesPerDay,
    grade: v.efficiencyScore,
  }));

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top High-Impact Overview Card (Professional Polish Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between shadow-sm gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Net Fleet OPEX & Efficiency
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
              OPTIMIZED
            </span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mt-1 font-mono tracking-tight">
            ${Math.round(totalDailyCost).toLocaleString()} <span className="text-base font-normal text-slate-400">/ day</span>
          </h2>
          <p className="text-sm text-emerald-600 font-medium mt-1.5 flex items-center gap-1.5 font-sans">
            <span className="font-bold font-mono">-${Math.round(netDailySavings).toLocaleString()} ({fuelSavingsPct.toFixed(1)}%)</span> net daily OPEX reduction vs baseline
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-10 w-full lg:w-auto">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Fleet</span>
            <p className="text-xl font-bold text-slate-800 mt-1 font-mono">{activeVessels} / {totalVessels} <span className="text-xs font-normal text-slate-500 font-sans">vessels</span></p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Abated Carbon</span>
            <p className="text-xl font-bold text-emerald-600 mt-1 font-mono">-{Math.round(baselineDailyCo2 - totalDailyCo2).toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">tCO₂/d</span></p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carbon Tax Risk</span>
            <p className="text-xl font-semibold text-slate-800 mt-1 underline decoration-emerald-400 underline-offset-4 font-sans">Low Exposure</p>
          </div>
          <div>
            <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {(['today', '7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    timeRange === r
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {r === 'today' ? 'Today' : r === '7d' ? '7D' : r === '30d' ? '30D' : '90D'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          id="kpi-fuel"
          title="Daily Fuel Demand"
          value={totalDailyFuel.toFixed(1)}
          unit="t / day"
          baseline={`${baselineDailyFuel.toFixed(1)} t`}
          change={`-${fuelSavingsPct.toFixed(1)}%`}
          changeType="positive"
          icon={Fuel}
          color="cyan"
        />

        <KPICard
          id="kpi-cost"
          title="Daily Bunker OPEX"
          value={`$${Math.round(totalDailyCost / 1000)}k`}
          unit="USD / day"
          baseline={`$${Math.round(baselineDailyCost / 1000)}k`}
          change={`-$${Math.round(netDailySavings / 1000)}k`}
          changeType="positive"
          icon={DollarSign}
          color="emerald"
        />

        <KPICard
          id="kpi-emissions"
          title="Direct CO₂e Output"
          value={Math.round(totalDailyCo2).toLocaleString()}
          unit="tCO₂e / day"
          baseline={`${Math.round(baselineDailyCo2).toLocaleString()} t`}
          change={`-${co2SavingsPct.toFixed(1)}%`}
          changeType="positive"
          icon={Leaf}
          color="teal"
        />

        <KPICard
          id="kpi-reliability"
          title="Schedule Reliability"
          value="98.4%"
          unit="on-time"
          subtitle="8 Active Global Corridors"
          change="+4.2%"
          changeType="positive"
          icon={CheckCircle2}
          color="indigo"
        />
      </div>

      {/* Quantum Action Callout */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1 font-mono uppercase">
              <Atom className="w-3 h-3 text-indigo-300" /> Quantum Metaheuristic
            </span>
            <span className="text-xs text-slate-400">Holtrop-Mennen Physics AI Engine</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Multi-Objective Green Fleet Deployment Optimization Ready
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulate quantum superposition states to compute optimal vessel speed, route assignments, cold ironing port connections, and fuel transitions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('optimization')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Atom className="w-4 h-4" /> Run Quantum Optimizer
          </button>
          <button
            onClick={() => navigate('prediction')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-3 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Gauge className="w-4 h-4 text-indigo-300" /> Predict Fuel
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trajectory Area Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Fleet Fuel Trajectory & Variance</h3>
              <p className="text-xs text-slate-400">Actual operations vs physics-informed quantum target (Tonnes/day)</p>
            </div>
            <button
              onClick={() => navigate('analytics')}
              className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              VIEW REPORT
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="baseline" name="Baseline (Unoptimized)" stroke="#94a3b8" strokeWidth={2} fill="url(#colorBaseline)" />
                <Area type="monotone" dataKey="actual" name="Current Operations" stroke="#64748b" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="optimized" name="Quantum-Optimized" stroke="#4f46e5" strokeWidth={2.5} fill="url(#colorOptimized)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Energy Mix (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Fleet Energy Mix</h3>
            <button
              onClick={() => navigate('scenarios')}
              className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              SCENARIOS
            </button>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fuelMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {fuelMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-50 text-xs">
            {fuelMixData.map((f) => (
              <div key={f.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }}></span>
                  <span className="text-slate-600">{f.name}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{f.value} vessels</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Allocation Style Vessel Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Fleet Deployment Registry</h3>
            <p className="text-xs text-slate-400">Real-time hydrodynamic fuel burn, CII ratings, and operational status</p>
          </div>
          <button
            onClick={() => navigate('fleet')}
            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            VIEW ALL FLEET <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase text-slate-400 font-bold border-b border-slate-50">
              <tr>
                <th className="pb-3">Vessel & Flag</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Fuel Tech</th>
                <th className="pb-3 text-right">Speed</th>
                <th className="pb-3 text-right">Daily Fuel</th>
                <th className="pb-3 text-right">CO₂e / Day</th>
                <th className="pb-3 text-center">CII Grade</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {vessels.slice(0, 6).map((v) => (
                <tr
                  key={v.id}
                  onClick={() => onSelectVessel && onSelectVessel(v)}
                  className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5">
                    <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {v.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {v.id} • {v.flag}
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600 font-medium text-xs">{v.type}</td>
                  <td className="py-3.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                      {v.fuelType}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono font-semibold text-slate-900 text-xs">
                    {v.currentSpeedKnots} kts
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-slate-900 text-xs">
                    {v.dailyFuelConsumptionTonnes} t
                  </td>
                  <td className="py-3.5 text-right font-mono text-slate-600 text-xs">
                    {v.co2EmissionsTonnesPerDay} t
                  </td>
                  <td className="py-3.5 text-center">
                    <EfficiencyBadge grade={v.efficiencyScore} />
                  </td>
                  <td className="py-3.5 text-right">
                    <StatusBadge status={v.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

