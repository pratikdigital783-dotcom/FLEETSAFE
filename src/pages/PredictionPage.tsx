import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Fuel,
  DollarSign,
  Leaf,
  Wind,
  Waves,
  Ship,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  TrendingUp,
  TrendingDown,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Vessel, MaritimeRoute, PredictionInputs, PredictionResult, VesselType, FuelType, WeatherCondition } from '../types';
import { FuelPredictionService } from '../services/predictionService';
import { EfficiencyBadge, DemoTag } from '../components/common/CommonComponents';

interface PredictionPageProps {
  vessels: Vessel[];
  initialVessel?: Vessel | null;
  initialRoute?: MaritimeRoute | null;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  vessels,
  initialVessel,
  initialRoute,
}) => {
  const [selectedVesselId, setSelectedVesselId] = useState<string>(initialVessel?.id || vessels[0]?.id || 'FS-101');

  // Prediction Inputs State
  const [inputs, setInputs] = useState<PredictionInputs>({
    vesselType: initialVessel?.type || 'Container Ship',
    capacity: initialVessel?.capacity || 15000,
    vesselAge: initialVessel?.ageYears || 3,
    enginePowerKw: initialVessel?.enginePowerKw || 58000,
    vesselSpeedKnots: initialVessel?.currentSpeedKnots || 18.2,
    distanceNm: initialRoute?.distanceNm || 5820,
    cargoLoadPct: 82,
    weatherCondition: initialRoute?.weatherCondition || 'Moderate',
    windSpeedKnots: initialRoute?.windSpeedKnots || 16,
    waveHeightM: initialRoute?.waveHeightM || 2.2,
    seaCondition: 'Moderate',
    fuelType: initialVessel?.fuelType || 'LNG',
    engineEfficiency: initialVessel?.engineEfficiency || 0.49,
    shorePowerAvailable: initialVessel?.shorePowerCapable || true,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<PredictionResult>(() => FuelPredictionService.predict(inputs));

  // Sync when initialVessel or initialRoute changes
  useEffect(() => {
    if (initialVessel || initialRoute) {
      if (initialVessel) setSelectedVesselId(initialVessel.id);
      const v = initialVessel || vessels.find((item) => item.id === selectedVesselId) || vessels[0];
      const updated: PredictionInputs = {
        ...inputs,
        ...(v
          ? {
              vesselType: v.type,
              capacity: v.capacity,
              vesselAge: v.ageYears,
              enginePowerKw: v.enginePowerKw,
              vesselSpeedKnots: v.currentSpeedKnots,
              fuelType: v.fuelType,
              engineEfficiency: v.engineEfficiency,
              shorePowerAvailable: v.shorePowerCapable,
            }
          : {}),
        ...(initialRoute
          ? {
              distanceNm: initialRoute.distanceNm,
              weatherCondition: initialRoute.weatherCondition,
              windSpeedKnots: initialRoute.windSpeedKnots,
              waveHeightM: initialRoute.waveHeightM,
            }
          : {}),
      };
      setInputs(updated);
      setResult(FuelPredictionService.predict(updated));
    }
  }, [initialVessel?.id, initialRoute?.id]);

  // Sync when vessel selection dropdown changes
  const handleVesselSelect = (vId: string) => {
    setSelectedVesselId(vId);
    const v = vessels.find((item) => item.id === vId);
    if (v) {
      const updated: PredictionInputs = {
        ...inputs,
        vesselType: v.type,
        capacity: v.capacity,
        vesselAge: v.ageYears,
        enginePowerKw: v.enginePowerKw,
        vesselSpeedKnots: v.currentSpeedKnots,
        fuelType: v.fuelType,
        engineEfficiency: v.engineEfficiency,
        shorePowerAvailable: v.shorePowerCapable,
      };
      setInputs(updated);
      setResult(FuelPredictionService.predict(updated));
    }
  };

  const handlePredict = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = FuelPredictionService.predict(inputs);
      setResult(res);
      setIsCalculating(false);
    }, 250);
  };

  const handleReset = () => {
    const defaultInputs: PredictionInputs = {
      vesselType: 'Container Ship',
      capacity: 15000,
      vesselAge: 3,
      enginePowerKw: 58000,
      vesselSpeedKnots: 18.0,
      distanceNm: 5820,
      cargoLoadPct: 80,
      weatherCondition: 'Moderate',
      windSpeedKnots: 15,
      waveHeightM: 2.0,
      seaCondition: 'Moderate',
      fuelType: 'LNG',
      engineEfficiency: 0.49,
      shorePowerAvailable: true,
    };
    setInputs(defaultInputs);
    setResult(FuelPredictionService.predict(defaultInputs));
  };

  // Breakdown chart data
  const breakdownChartData = [
    { name: 'Hull Resistance', value: result.breakdown.hydrodynamicHullResistanceTonnes, color: '#0284c7' },
    { name: 'Weather / Waves', value: result.breakdown.weatherWindWaveResistanceTonnes, color: '#f59e0b' },
    { name: 'Payload Displ.', value: result.breakdown.cargoDisplacementLoadTonnes, color: '#6366f1' },
    { name: 'Auxiliary Power', value: result.breakdown.auxiliaryLoadTonnes, color: '#64748b' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Physics-Informed Fuel Demand Predictor
            </h1>
            <DemoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ensembled maritime hydrodynamic resistance model (Holtrop-Mennen + Machine Learning regression).
          </p>
        </div>

        {/* Quick Vessel Preset */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-semibold hidden md:inline">Preset:</span>
          <select
            value={selectedVesselId}
            onChange={(e) => handleVesselSelect(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500"
          >
            {vessels.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.type} • {v.fuelType})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-indigo-600" />
              Voyage & Vessel Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Vessel Type & Fuel */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vessel Type</label>
                <select
                  value={inputs.vesselType}
                  onChange={(e) => setInputs({ ...inputs, vesselType: e.target.value as VesselType })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                >
                  <option value="Container Ship">Container Ship</option>
                  <option value="Bulk Carrier">Bulk Carrier</option>
                  <option value="Tanker">Tanker</option>
                  <option value="Ro-Ro">Ro-Ro</option>
                  <option value="General Cargo">General Cargo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                <select
                  value={inputs.fuelType}
                  onChange={(e) => setInputs({ ...inputs, fuelType: e.target.value as FuelType })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold"
                >
                  <option value="Marine Diesel">Marine Diesel (MDO)</option>
                  <option value="LNG">LNG (Liquefied Gas)</option>
                  <option value="Methanol">Methanol (Green/Bio)</option>
                  <option value="Hydrogen">Hydrogen (Green H2)</option>
                  <option value="Ammonia">Ammonia (Green NH3)</option>
                </select>
              </div>
            </div>

            {/* Cruising Speed Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Cruising Speed</label>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                  {inputs.vesselSpeedKnots} knots
                </span>
              </div>
              <input
                type="range"
                min="10.0"
                max="24.0"
                step="0.2"
                value={inputs.vesselSpeedKnots}
                onChange={(e) => setInputs({ ...inputs, vesselSpeedKnots: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10.0 kts (Eco)</span>
                <span>17.0 kts</span>
                <span>24.0 kts (High Power)</span>
              </div>
            </div>

            {/* Distance & Cargo Load */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Distance (NM)</label>
                <input
                  type="number"
                  value={inputs.distanceNm}
                  onChange={(e) => setInputs({ ...inputs, distanceNm: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cargo Load: {inputs.cargoLoadPct}%</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={inputs.cargoLoadPct}
                  onChange={(e) => setInputs({ ...inputs, cargoLoadPct: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer mt-1.5"
                />
              </div>
            </div>

            {/* Weather & Environmental Factors */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-600" />
                <span>Environmental & Sea Conditions</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Weather</label>
                  <select
                    value={inputs.weatherCondition}
                    onChange={(e) => setInputs({ ...inputs, weatherCondition: e.target.value as WeatherCondition })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] text-slate-900"
                  >
                    <option value="Calm">Calm</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Rough Sea">Rough Sea</option>
                    <option value="Storm Warning">Storm Warning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Wind (kts)</label>
                  <input
                    type="number"
                    value={inputs.windSpeedKnots}
                    onChange={(e) => setInputs({ ...inputs, windSpeedKnots: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Wave (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.waveHeightM}
                    onChange={(e) => setInputs({ ...inputs, waveHeightM: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Powertrain & Shore Power */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Engine MCR (kW)</label>
                <input
                  type="number"
                  value={inputs.enginePowerKw}
                  onChange={(e) => setInputs({ ...inputs, enginePowerKw: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thermal Efficiency</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.35"
                  max="0.55"
                  value={inputs.engineEfficiency}
                  onChange={(e) => setInputs({ ...inputs, engineEfficiency: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="predShorePower"
                checked={inputs.shorePowerAvailable}
                onChange={(e) => setInputs({ ...inputs, shorePowerAvailable: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <label htmlFor="predShorePower" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Utilize High Voltage Shore Power in Port (Cold Ironing)
              </label>
            </div>

            <button
              onClick={handlePredict}
              disabled={isCalculating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all mt-2"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Computing Hydrodynamic Equations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Predict Fuel Consumption</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Prediction Results Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Predicted Metrics Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  Model Prediction Output
                </span>
                <h3 className="text-base font-bold text-white mt-1">Voyage Energy & Emissions Demand</h3>
              </div>

              <div className="flex items-center space-x-2">
                <EfficiencyBadge grade={result.efficiencyScore} />
                <span className="text-xs text-slate-400 font-mono font-semibold">
                  Confidence: {result.confidenceIndicatorPct}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Voyage Fuel</span>
                <p className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
                  {result.fuelConsumptionTonnes.toLocaleString()} <span className="text-xs font-semibold text-slate-300">tonnes</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">{result.fuelConsumptionPerDay} t / day</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Bunker Cost</span>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  ${Math.round(result.fuelCostUsd / 1000).toLocaleString()}k
                </p>
                <p className="text-[10px] text-slate-400 mt-1">${result.fuelCostUsd.toLocaleString()} USD</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Operational CO₂e</span>
                <p className="text-2xl font-black text-teal-400 font-mono mt-0.5">
                  {result.co2eOperationalTonnes.toLocaleString()} <span className="text-xs font-semibold text-slate-300">t</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Tank-to-Wake (TTW)</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Voyage Duration</span>
                <p className="text-2xl font-black text-indigo-300 font-mono mt-0.5">
                  {result.voyageDurationHours} <span className="text-xs font-semibold text-slate-300">hrs</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">{(result.voyageDurationHours / 24).toFixed(1)} sea days</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>
                <strong>Well-to-Wake (Lifecycle) GHG:</strong> {result.co2eLifecycleTonnes.toLocaleString()} tCO₂e
              </span>
              {inputs.shorePowerAvailable && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Shore Power saving ~{result.breakdown.shorePowerSavedTonnes} t fuel
                </span>
              )}
            </div>
          </div>

          {/* Hydrodynamic Component Breakdown Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hydrodynamic Resistance Breakdown</h3>
                <p className="text-xs text-slate-500">Components contributing to total fuel consumption (Tonnes)</p>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" name="Fuel Portion (t)" radius={[4, 4, 0, 0]}>
                    {breakdownChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Explainable AI: SHAP Feature Contributions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Explainable AI (XAI) Feature Attribution
                </h3>
                <p className="text-xs text-slate-500">How each operational input influenced the predicted consumption</p>
              </div>
            </div>

            <div className="space-y-2">
              {result.shapValues.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">{item.feature}</span>
                    <p className="text-[11px] text-slate-500">{item.value}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                        item.impact === 'increase'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.impact === 'decrease'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.impact === 'increase' ? (
                        <TrendingUp className="w-3 h-3 text-rose-600" />
                      ) : item.impact === 'decrease' ? (
                        <TrendingDown className="w-3 h-3 text-emerald-600" />
                      ) : null}
                      {item.contributionPct}% Impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
