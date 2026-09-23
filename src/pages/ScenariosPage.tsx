import React, { useState } from 'react';
import {
  Flame,
  DollarSign,
  Leaf,
  Sliders,
  TrendingDown,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FuelType, VesselType, ScenarioResultRow } from '../types';
import { ScenarioService, ScenarioParams } from '../services/scenarioService';
import { DemoTag } from '../components/common/CommonComponents';

export const ScenariosPage: React.FC = () => {
  const [params, setParams] = useState<ScenarioParams>({
    vesselType: 'Container Ship',
    capacity: 15000,
    enginePowerKw: 58000,
    speedKnots: 18.0,
    distanceNm: 6000,
    cargoLoadPct: 80,
    carbonTaxUsdPerTonne: 75,
    shorePowerAvailable: true,
    fuelPriceMultipliers: {
      'Marine Diesel': 1.0,
      'LNG': 1.0,
      'Methanol': 1.0,
      'Hydrogen': 1.0,
      'Ammonia': 1.0,
    },
  });

  const results: ScenarioResultRow[] = ScenarioService.runScenario(params);

  const handlePriceMultiplierChange = (fuel: FuelType, val: number) => {
    setParams((prev) => ({
      ...prev,
      fuelPriceMultipliers: {
        ...prev.fuelPriceMultipliers,
        [fuel]: val,
      },
    }));
  };

  const handlePreset = (preset: 'baseline' | 'high_carbon_tax' | 'cheap_hydrogen' | 'oil_surge') => {
    if (preset === 'baseline') {
      setParams({
        ...params,
        carbonTaxUsdPerTonne: 75,
        fuelPriceMultipliers: { 'Marine Diesel': 1.0, 'LNG': 1.0, 'Methanol': 1.0, 'Hydrogen': 1.0, 'Ammonia': 1.0 },
      });
    } else if (preset === 'high_carbon_tax') {
      setParams({
        ...params,
        carbonTaxUsdPerTonne: 180,
        fuelPriceMultipliers: { 'Marine Diesel': 1.15, 'LNG': 1.05, 'Methanol': 0.95, 'Hydrogen': 0.85, 'Ammonia': 0.9 },
      });
    } else if (preset === 'cheap_hydrogen') {
      setParams({
        ...params,
        carbonTaxUsdPerTonne: 100,
        fuelPriceMultipliers: { 'Marine Diesel': 1.1, 'LNG': 1.0, 'Methanol': 0.9, 'Hydrogen': 0.45, 'Ammonia': 0.6 },
      });
    } else if (preset === 'oil_surge') {
      setParams({
        ...params,
        carbonTaxUsdPerTonne: 120,
        fuelPriceMultipliers: { 'Marine Diesel': 1.45, 'LNG': 1.1, 'Methanol': 0.9, 'Hydrogen': 0.8, 'Ammonia': 0.85 },
      });
    }
  };

  // Cost comparison chart data
  const costChartData = results.map((r) => ({
    name: r.fuelType,
    fuelCost: Math.round(r.fuelCostUsd / 1000),
    carbonTax: Math.round(r.carbonTaxCostUsd / 1000),
    totalCost: Math.round(r.totalCostUsd / 1000),
  }));

  // Emissions chart data
  const emissionsChartData = results.map((r) => ({
    name: r.fuelType,
    ttwEmissions: r.operationalCo2eTonnes,
    wtwEmissions: r.lifecycleCo2eTonnes,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Alternative Fuel Scenario & What-If Sandbox
            </h1>
            <DemoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate Total Cost of Ownership (TCO), Carbon Taxation, and Well-to-Wake Lifecycle GHG across 5 transition fuels.
          </p>
        </div>

        {/* Quick What-If Presets */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-semibold mr-1">Presets:</span>
          <button
            onClick={() => handlePreset('baseline')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Baseline 2026
          </button>
          <button
            onClick={() => handlePreset('high_carbon_tax')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
          >
            EU ETS $180/t Tax
          </button>
          <button
            onClick={() => handlePreset('cheap_hydrogen')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
          >
            H₂ Subsidy (-55%)
          </button>
          <button
            onClick={() => handlePreset('oil_surge')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Bunker Oil Spike (+45%)
          </button>
        </div>
      </div>

      {/* Sandbox Sliders & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            Macroeconomic & Operational What-If Parameters
          </h3>
          <span className="text-[11px] text-slate-400">Dynamic sensitivity model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Carbon Tax Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Carbon Pricing / Tax:</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ${params.carbonTaxUsdPerTonne} / tCO₂e
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              step="5"
              value={params.carbonTaxUsdPerTonne}
              onChange={(e) => setParams({ ...params, carbonTaxUsdPerTonne: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$0 (No penalty)</span>
              <span>$100 (EU MRV)</span>
              <span>$250 (IMO Target)</span>
            </div>
          </div>

          {/* Speed & Distance */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Voyage Distance:</span>
              <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {params.distanceNm.toLocaleString()} NM
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="12000"
              step="200"
              value={params.distanceNm}
              onChange={(e) => setParams({ ...params, distanceNm: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1,000 NM</span>
              <span>6,000 NM</span>
              <span>12,000 NM (Asia-Europe)</span>
            </div>
          </div>

          {/* Shore Power Toggle */}
          <div className="flex flex-col justify-center space-y-2 pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="scenarioShorePower"
                checked={params.shorePowerAvailable}
                onChange={(e) => setParams({ ...params, shorePowerAvailable: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <label htmlFor="scenarioShorePower" className="text-xs font-bold text-slate-800 cursor-pointer">
                Port Cold Ironing Enabled
              </label>
            </div>
            <p className="text-[11px] text-slate-500">
              Saves auxiliary diesel power while berthed, crediting emissions against port limits.
            </p>
          </div>
        </div>
      </div>

      {/* Alternative Fuels Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Fuel Performance Matrix (Voyage of {params.distanceNm.toLocaleString()} NM @ {params.speedKnots} kts)
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">Includes IMO LCA Lifecycle Methodology</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Fuel Alternative</th>
                <th className="py-3 px-4">Fuel Consumption</th>
                <th className="py-3 px-4">Fuel Cost (Bunker)</th>
                <th className="py-3 px-4">Carbon Tax Cost</th>
                <th className="py-3 px-4">Total Voyage OPEX</th>
                <th className="py-3 px-4">Operational (TTW) CO₂</th>
                <th className="py-3 px-4">Lifecycle (WTW) GHG</th>
                <th className="py-3 px-4">Bunkering Readiness</th>
                <th className="py-3 px-4">Viability Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((row) => (
                <tr key={row.fuelType} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Flame
                      className={`w-4 h-4 ${
                        row.fuelType === 'Marine Diesel'
                          ? 'text-slate-500'
                          : row.fuelType === 'LNG'
                          ? 'text-cyan-600'
                          : row.fuelType === 'Methanol'
                          ? 'text-emerald-600'
                          : row.fuelType === 'Hydrogen'
                          ? 'text-indigo-600'
                          : 'text-purple-600'
                      }`}
                    />
                    <span>{row.fuelType}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {row.fuelConsumptionTonnes.toLocaleString()} t
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    ${(row.fuelCostUsd / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-700 font-semibold">
                    ${(row.carbonTaxCostUsd / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ${(row.totalCostUsd / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {row.operationalCo2eTonnes.toLocaleString()} t
                  </td>
                  <td className="py-3.5 px-4 font-mono text-teal-700 font-semibold">
                    {row.lifecycleCo2eTonnes.toLocaleString()} t
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${row.availabilityIndex}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{row.availabilityIndex}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md font-mono font-bold text-xs ${
                        row.overallScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.overallScore >= 65
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {row.overallScore} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Cost Comparison Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Total Voyage OPEX Breakdown ($k USD)</h3>
            <p className="text-xs text-slate-500">Fuel bunker price + carbon tax liability under ${params.carbonTaxUsdPerTonne}/t</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="fuelCost" name="Fuel Bunker ($k)" stackId="a" fill="#0284c7" />
                <Bar dataKey="carbonTax" name="Carbon Tax ($k)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lifecycle Emissions Comparison Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">GHG Footprint: TTW vs WTW Lifecycle (tCO₂e)</h3>
            <p className="text-xs text-slate-500">Comparing direct tailpipe (Tank-to-Wake) vs total Well-to-Wake footprint</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionsChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="ttwEmissions" name="Tank-to-Wake (Direct)" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wtwEmissions" name="Well-to-Wake (Lifecycle)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
