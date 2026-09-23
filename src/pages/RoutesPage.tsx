import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Wind,
  Waves,
  Clock,
  Fuel,
  Leaf,
  Navigation,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MaritimeRoute } from '../types';
import { StatusBadge, DemoTag } from '../components/common/CommonComponents';

interface RoutesPageProps {
  routes: MaritimeRoute[];
  onSelectRouteForPrediction?: (r: MaritimeRoute) => void;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({
  routes,
  onSelectRouteForPrediction,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || 'R-01');
  const [routingStrategy, setRoutingStrategy] = useState<'weather_optimal' | 'shortest_distance' | 'slow_steaming'>('weather_optimal');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Synthetic Route Waypoint profile (Speed, Wave Height, Wind Speed)
  const waypointProfile = [
    { waypoint: 'WP-0 (Origin)', distanceNm: 0, waveHeightM: 1.2, windKnots: 10, recommendedSpeed: 18.5, fuelBurnT: 12 },
    { waypoint: 'WP-1 (Strait)', distanceNm: Math.round(selectedRoute.distanceNm * 0.25), waveHeightM: selectedRoute.waveHeightM, windKnots: selectedRoute.windSpeedKnots, recommendedSpeed: 16.8, fuelBurnT: 28 },
    { waypoint: 'WP-2 (Mid-Ocean)', distanceNm: Math.round(selectedRoute.distanceNm * 0.5), waveHeightM: selectedRoute.waveHeightM * 1.3, windKnots: selectedRoute.windSpeedKnots * 1.2, recommendedSpeed: 15.5, fuelBurnT: 34 },
    { waypoint: 'WP-3 (Approach)', distanceNm: Math.round(selectedRoute.distanceNm * 0.75), waveHeightM: selectedRoute.waveHeightM * 0.9, windKnots: selectedRoute.windSpeedKnots * 0.8, recommendedSpeed: 17.2, fuelBurnT: 26 },
    { waypoint: 'WP-4 (Dest)', distanceNm: selectedRoute.distanceNm, waveHeightM: 1.0, windKnots: 12, recommendedSpeed: 14.0, fuelBurnT: 10 },
  ];

  // Route Strategy Comparison Data
  const strategyComparison = [
    {
      strategy: 'Shortest Great-Circle',
      distanceNm: selectedRoute.distanceNm,
      fuelTonnes: Math.round(selectedRoute.distanceNm * 0.125),
      co2Tonnes: Math.round(selectedRoute.distanceNm * 0.125 * 3.114),
      etaHours: Math.round(selectedRoute.distanceNm / 19.0),
      riskScore: 'High (Storm Zone)',
    },
    {
      strategy: 'AI Weather-Optimal (Recommended)',
      distanceNm: Math.round(selectedRoute.distanceNm * 1.03),
      fuelTonnes: Math.round(selectedRoute.distanceNm * 0.102),
      co2Tonnes: Math.round(selectedRoute.distanceNm * 0.102 * 3.114),
      etaHours: Math.round((selectedRoute.distanceNm * 1.03) / 17.5),
      riskScore: 'Low (Fair Seas)',
    },
    {
      strategy: 'Ultra Slow-Steaming',
      distanceNm: selectedRoute.distanceNm,
      fuelTonnes: Math.round(selectedRoute.distanceNm * 0.088),
      co2Tonnes: Math.round(selectedRoute.distanceNm * 0.088 * 3.114),
      etaHours: Math.round(selectedRoute.distanceNm / 14.0),
      riskScore: 'Low (Speed Capped)',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Maritime Corridors & Green Weather Routing
            </h1>
            <DemoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic isochrone weather routing taking ocean currents, swell, and wind resistance into account.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
          >
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.distanceNm.toLocaleString()} NM)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Corridor Overview Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Corridor {selectedRoute.id}
              </span>
              <h2 className="text-xl font-extrabold text-white">{selectedRoute.name}</h2>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <span className="font-semibold">{selectedRoute.origin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">{selectedRoute.destination}</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-cyan-300 font-bold">{selectedRoute.distanceNm.toLocaleString()} NM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Swell / Waves</span>
              <p className="text-base font-bold text-amber-400 font-mono mt-0.5">{selectedRoute.waveHeightM} meters</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Wind Speed</span>
              <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">{selectedRoute.windSpeedKnots} knots</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Corridor Congestion</span>
              <p className="text-base font-bold text-indigo-300 mt-0.5">{selectedRoute.trafficDensity}</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Delivery Window</span>
              <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{selectedRoute.deadlineHours} hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Waypoint Hydrodynamics & Throttling Plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Waypoint Hydrodynamic Profile & Eco-Speed Throttling</h3>
            <p className="text-xs text-slate-500">
              AI recommended engine throttling through rough sea sectors to minimize hydrodynamic drag penalty
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Estimated Fuel Savings: -18.4%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waypointProfile} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="waypoint" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="recommendedSpeed" name="Recommended Speed (kts)" stroke="#6366f1" strokeWidth={2.5} />
              <Line type="monotone" dataKey="waveHeightM" name="Significant Wave Ht (m)" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="fuelBurnT" name="Leg Fuel Burn (t)" stroke="#0284c7" strokeWidth={2} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Routing Strategy Options Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Routing Strategy Trade-Off Evaluation
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">Comparing 3 Voyage Trajectories</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Navigation Strategy</th>
                <th className="py-3 px-4">Total Distance</th>
                <th className="py-3 px-4">Predicted Fuel</th>
                <th className="py-3 px-4">CO₂e Footprint</th>
                <th className="py-3 px-4">Voyage ETA</th>
                <th className="py-3 px-4">Swell / Sea Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {strategyComparison.map((strat, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50 transition-colors ${
                    strat.strategy.includes('Recommended') ? 'bg-indigo-50/40 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {strat.strategy.includes('Recommended') && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                      <span>{strat.strategy}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {strat.distanceNm.toLocaleString()} NM
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-700">
                    {strat.fuelTonnes.toLocaleString()} tonnes
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                    {strat.co2Tonnes.toLocaleString()} t
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-800">
                    {strat.etaHours} hrs
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        strat.riskScore.includes('Low')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {strat.riskScore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectRouteForPrediction && onSelectRouteForPrediction(selectedRoute)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Simulate
                    </button>
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
