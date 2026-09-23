import React, { useState } from 'react';
import {
  Zap,
  Plug,
  Leaf,
  DollarSign,
  TrendingDown,
  Anchor,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Sparkles,
  ArrowRight,
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
} from 'recharts';
import { ShorePowerPort } from '../types';
import { SHORE_POWER_PORTS } from '../data/constants';
import { StatusBadge, DemoTag } from '../components/common/CommonComponents';

export const ShorePowerPage: React.FC = () => {
  const [ports] = useState<ShorePowerPort[]>(SHORE_POWER_PORTS);
  const [selectedPortId, setSelectedPortId] = useState<string>('port-a');
  const [berthHours, setBerthHours] = useState<number>(28);
  const [auxiliaryPowerKw, setAuxiliaryPowerKw] = useState<number>(2400);

  const selectedPort = ports.find((p) => p.id === selectedPortId) || ports[0];

  // Cold Ironing Financial and Carbon Savings Calculation
  // Diesel Auxiliary Burn Rate: ~ 185 g/kWh * Auxiliary Kw
  const dieselBurnRateTonnesPerHour = (auxiliaryPowerKw * 185) / 1000000;
  const totalDieselSavedTonnes = dieselBurnRateTonnesPerHour * berthHours;
  const dieselCostSavedUsd = totalDieselSavedTonnes * 680; // $680/t MDO

  const gridElectricityConsumedKwh = auxiliaryPowerKw * berthHours;
  const gridElectricityCostUsd = gridElectricityConsumedKwh * selectedPort.electricityCostUsdPerKwh;

  const netOpexSavingsUsd = dieselCostSavedUsd - gridElectricityCostUsd;

  // Emissions:
  const dieselCo2EmittedTonnes = totalDieselSavedTonnes * 3.114;
  const gridCo2EmittedTonnes = (gridElectricityConsumedKwh * selectedPort.gridEmissionFactorGCo2Kwh) / 1000000;
  const netCo2AbatedTonnes = Math.max(0, dieselCo2EmittedTonnes - gridCo2EmittedTonnes);

  const annualAbatementChartData = ports.map((p) => ({
    name: p.name.replace('Port of ', ''),
    abatedCo2: p.annualCo2AbatedTonnes,
    berths: p.berthsWithShorePower,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Shore Power (Cold Ironing) Optimization Portal
            </h1>
            <DemoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyze High-Voltage Shore Connection (HVSC) terminal infrastructure to eliminate port-berth diesel emissions.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold self-start sm:self-auto">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>Cold Ironing Mandate Active</span>
        </div>
      </div>

      {/* Port Terminal Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Major Maritime Terminals with Shore Power Infrastructure
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">5 Global Deep-Sea Hubs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Terminal & Port</th>
                <th className="py-3 px-4">HVSC Berths</th>
                <th className="py-3 px-4">Grid Carbon Intensity</th>
                <th className="py-3 px-4">Electricity Tariff</th>
                <th className="py-3 px-4">Aux Diesel Savings</th>
                <th className="py-3 px-4">Annual CO₂ Abated</th>
                <th className="py-3 px-4">Status Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ports.map((port) => (
                <tr
                  key={port.id}
                  onClick={() => setSelectedPortId(port.id)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedPortId === port.id ? 'bg-indigo-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{port.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {port.code} • {port.country}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {port.berthsWithShorePower} berths
                    <div className="text-[10px] text-slate-400 font-normal">{port.berthUtilizationPct}% utilized</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-800">
                    {port.gridEmissionFactorGCo2Kwh} gCO₂/kWh
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ${port.electricityCostUsdPerKwh.toFixed(2)} / kWh
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                    ~{port.auxDieselSavingTonnesPerHour} t / hr
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    {port.annualCo2AbatedTonnes.toLocaleString()} t
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={port.recommendedStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Port Call Cold-Ironing Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calculator Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plug className="w-4 h-4 text-emerald-600" />
              Simulate Port Call Cold-Ironing
            </h3>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {selectedPort.name}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Terminal</label>
              <select
                value={selectedPortId}
                onChange={(e) => setSelectedPortId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
              >
                {ports.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Berth Laytime Duration:</span>
                <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{berthHours} Hours</span>
              </div>
              <input
                type="range"
                min="6"
                max="72"
                value={berthHours}
                onChange={(e) => setBerthHours(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>6 hrs (Fast Feeder)</span>
                <span>28 hrs (Average)</span>
                <span>72 hrs (Mega Container)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Auxiliary Electrical Load:</span>
                <span className="font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  {(auxiliaryPowerKw / 1000).toFixed(1)} MW ({auxiliaryPowerKw} kW)
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={auxiliaryPowerKw}
                onChange={(e) => setAuxiliaryPowerKw(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5 MW (Bulk)</span>
                <span>2.4 MW (Reefer Liner)</span>
                <span>5.0 MW (Cruise/Large)</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Terminal Electricity Tariff:</span>
                <span className="font-bold text-slate-900">${selectedPort.electricityCostUsdPerKwh}/kWh</span>
              </div>
              <div className="flex justify-between">
                <span>Local Clean Grid Intensity:</span>
                <span className="font-bold text-slate-900">{selectedPort.gridEmissionFactorGCo2Kwh} gCO₂/kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Cards & Comparison (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Result Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">CO₂ Abated (Port)</span>
              <p className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {netCo2AbatedTonnes.toFixed(1)} <span className="text-xs font-semibold">tonnes</span>
              </p>
              <p className="text-[10px] text-emerald-600 mt-1">Zero tailpipe particulates</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Aux Diesel Saved</span>
              <p className="text-2xl font-black text-blue-700 font-mono mt-0.5">
                {totalDieselSavedTonnes.toFixed(1)} <span className="text-xs font-semibold">tonnes</span>
              </p>
              <p className="text-[10px] text-blue-600 mt-1">${Math.round(dieselCostSavedUsd).toLocaleString()} MDO value</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-indigo-800 uppercase">Net Economic Saving</span>
              <p className="text-2xl font-black text-indigo-700 font-mono mt-0.5">
                ${Math.round(netOpexSavingsUsd).toLocaleString()}
              </p>
              <p className="text-[10px] text-indigo-600 mt-1">Grid OPEX vs Bunker cost</p>
            </div>
          </div>

          {/* Annual Terminal Abatement Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Annual Terminal CO₂ Abatement Potential (tCO₂e)</h3>
              <p className="text-xs text-slate-500">Comparing emissions offset when calling electrified port terminals</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualAbatementChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="abatedCo2" name="Annual CO₂ Abated (t)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
