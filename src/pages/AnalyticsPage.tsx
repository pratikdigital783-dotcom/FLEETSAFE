import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Leaf,
  ShieldCheck,
  TrendingDown,
  Calendar,
  Layers,
  Fuel,
  Sparkles,
  CheckCircle2,
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
import { DataService } from '../services/dataService';
import { DemoTag } from '../components/common/CommonComponents';

interface AnalyticsPageProps {
  vessels: Vessel[];
  routes: MaritimeRoute[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  vessels,
  routes,
}) => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');

  // CII Ratings Breakdown
  const ciiDistribution = [
    { grade: 'Grade A (Superior)', count: 4, fill: '#10b981' },
    { grade: 'Grade B (Good)', count: 3, fill: '#06b6d4' },
    { grade: 'Grade C (Standard)', count: 1, fill: '#3b82f6' },
    { grade: 'Grade D (Action Req.)', count: 0, fill: '#f59e0b' },
    { grade: 'Grade E (Inferior)', count: 0, fill: '#ef4444' },
  ];

  // Pollutant Emissions breakdown (t/month)
  const pollutantData = [
    { name: 'Jan', co2: 2450, sox: 4.2, nox: 18.5, pm: 1.1 },
    { name: 'Feb', co2: 2310, sox: 3.8, nox: 17.2, pm: 0.9 },
    { name: 'Mar', co2: 2180, sox: 3.1, nox: 15.8, pm: 0.8 },
    { name: 'Apr', co2: 1950, sox: 2.4, nox: 14.1, pm: 0.6 },
    { name: 'May', co2: 1820, sox: 1.9, nox: 12.8, pm: 0.5 },
    { name: 'Jun', co2: 1710, sox: 1.5, nox: 11.6, pm: 0.4 },
  ];

  // IMO 2030 / 2050 Net-Zero Trajectory
  const imoTrajectory = [
    { year: '2023', actual: 100, target: 100 },
    { year: '2024', actual: 92, target: 95 },
    { year: '2025', actual: 84, target: 89 },
    { year: '2026 (Now)', actual: 76, target: 82 },
    { year: '2028', actual: null, target: 70 },
    { year: '2030', actual: null, target: 60 },
    { year: '2040', actual: null, target: 30 },
    { year: '2050', actual: null, target: 0 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ESG Compliance & Fleet Emissions Analytics
            </h1>
            <DemoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditable IMO DCS, EU MRV, and Carbon Intensity Indicator (CII) verified analytics and reports.
          </p>
        </div>

        {/* CSV Export Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => DataService.exportFleetCsv(vessels)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Fleet CSV Report</span>
          </button>
        </div>
      </div>

      {/* Top ESG Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fleet CII Grade</span>
          <p className="text-3xl font-black text-emerald-600 font-mono mt-1">Grade A</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">100% IMO 2026 Compliant</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">YTD CO₂ Abated</span>
          <p className="text-3xl font-black text-teal-600 font-mono mt-1">4,280 t</p>
          <p className="text-[11px] text-teal-700 font-semibold mt-1">-23.4% vs 2023 Baseline</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SOx / NOx Reduction</span>
          <p className="text-3xl font-black text-cyan-600 font-mono mt-1">-64.2%</p>
          <p className="text-[11px] text-cyan-700 font-semibold mt-1">Low-ECA certified</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">EU ETS Liability</span>
          <p className="text-3xl font-black text-indigo-600 font-mono mt-1">-$321k</p>
          <p className="text-[11px] text-indigo-700 font-semibold mt-1">Carbon tax penalty saved</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMO 2030 / 2050 Trajectory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">IMO 2030 / 2050 Net-Zero Fleet Decarbonization Trajectory</h3>
              <p className="text-xs text-slate-500">Fleet carbon intensity indexed to 2008 baseline (100)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Ahead of Schedule
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={imoTrajectory} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis domain={[0, 110]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="actual" name="Fleet Actual Intensity" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2.5} />
                <Area type="monotone" dataKey="target" name="IMO Statutory Target Cap" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CII Fleet Distribution Pie */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Fleet Carbon Intensity Indicator (CII) Rating Distribution</h3>
            <p className="text-xs text-slate-500">Statutory rating compliance per MARPOL Annex VI regulations</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ciiDistribution.filter((c) => c.count > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="grade"
                  label={({ grade, count }) => `${grade}: ${count}`}
                >
                  {ciiDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Pollutant Trends Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Monthly Fleetwide Atmospheric Emissions (Tonnes)</h3>
          <p className="text-xs text-slate-500">Aggregated CO₂e, SOx scrubbed, NOx catalytic, and PM particulate emissions</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pollutantData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="co2" name="CO₂ Emissions (t)" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="nox" name="NOx (t)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sox" name="SOx (t)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
