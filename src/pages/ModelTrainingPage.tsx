import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  Database,
  BarChart2,
  TrendingUp,
  Activity,
  Layers,
  Terminal,
  Sparkles,
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { ModelTrainingState } from '../types';
import { ModelTrainingService } from '../services/modelTrainingService';
import { DemoTag } from '../components/common/CommonComponents';

export const ModelTrainingPage: React.FC = () => {
  const [state, setState] = useState<ModelTrainingState>(() => ModelTrainingService.getInitialTrainingState());
  const [selectedModel, setSelectedModel] = useState<ModelTrainingState['selectedModel']>('Random Forest (Ensemble)');

  const handleStartTraining = async () => {
    setState((prev) => ({ ...prev, isTraining: true, trainingProgressPct: 0, currentEpoch: 0 }));
    const finalState = await ModelTrainingService.simulateRetrain(selectedModel, (partial) => {
      setState((prev) => ({ ...prev, ...partial }));
    });
    setState(finalState);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Machine Learning Training & Validation Lab
            </h1>
            <DemoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Train, evaluate, and benchmark surrogate regression models on 1,280 validated hydrodynamic voyage observations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as any)}
            disabled={state.isTraining}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Random Forest (Ensemble)">Random Forest (Ensemble)</option>
            <option value="Gradient Boosting Regressor">Gradient Boosting Regressor</option>
            <option value="Quantum-Kernel Ridge">Quantum-Kernel Ridge (Q-Kernel)</option>
            <option value="Deep Multi-Layer Perceptron">Deep MLP Neural Net</option>
          </select>

          <button
            onClick={handleStartTraining}
            disabled={state.isTraining}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            {state.isTraining ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Training {state.trainingProgressPct}%</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Train Model</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dataset & Architecture Info Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 text-xs">
            <Database className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold uppercase tracking-wider">Dataset Size</span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{state.datasetSize.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Maritime voyage profiles</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 text-xs">
            <Layers className="w-4 h-4 text-cyan-600" />
            <span className="font-semibold uppercase tracking-wider">Train / Test Split</span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">80% / 20%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">1,024 train / 256 test</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 text-xs">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold uppercase tracking-wider">Surrogate Model</span>
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1 truncate">{state.selectedModel}</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Validated & Export Ready</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-slate-500 text-xs">
            <Activity className="w-4 h-4 text-amber-600" />
            <span className="font-semibold uppercase tracking-wider">Training Epoch</span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {state.currentEpoch} / {state.totalEpochs}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{state.isTraining ? 'Optimizing gradients...' : 'Converged'}</p>
        </div>
      </div>

      {/* Live Training Progress Bar (Active when training) */}
      {state.isTraining && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-lg space-y-2 animate-in fade-in-50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              Epoch Optimization: {state.currentEpoch} of {state.totalEpochs} ({state.trainingProgressPct}%)
            </span>
            <span className="font-mono text-emerald-400 font-bold">R²: {state.metrics.r2Score.toFixed(3)}</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-150"
              style={{ width: `${state.trainingProgressPct}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Model Performance Scores (MAE, RMSE, MAPE, R2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">R² Coefficient</span>
          <p className="text-3xl font-black text-emerald-700 font-mono mt-1">{state.metrics.r2Score.toFixed(3)}</p>
          <p className="text-[11px] text-emerald-600 mt-1">96.8% variance explained</p>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">MAE (Mean Error)</span>
          <p className="text-3xl font-black text-cyan-700 font-mono mt-1">{state.metrics.mae.toFixed(2)}</p>
          <p className="text-[11px] text-cyan-600 mt-1">Tonnes / day deviation</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">RMSE</span>
          <p className="text-3xl font-black text-blue-700 font-mono mt-1">{state.metrics.rmse.toFixed(2)}</p>
          <p className="text-[11px] text-blue-600 mt-1">Root Mean Square Error</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">MAPE</span>
          <p className="text-3xl font-black text-indigo-700 font-mono mt-1">{state.metrics.mape.toFixed(2)}%</p>
          <p className="text-[11px] text-indigo-600 mt-1">Mean Absolute % Error</p>
        </div>
      </div>

      {/* Validation Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actual vs Predicted Scatter */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Actual vs Predicted Fuel Consumption</h3>
              <p className="text-xs text-slate-500">Test set validation scatter with diagonal ideal fit line</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              High Homoscedasticity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="actual" name="Actual Fuel (t)" unit=" t" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis type="number" dataKey="predicted" name="Predicted Fuel (t)" unit=" t" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Scatter name="Observations" data={state.actualVsPredicted} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Model Feature Importance Gini Index (%)</h3>
            <p className="text-xs text-slate-500">Relative contribution of input features in predicting fuel demand</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.featureImportance} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="importancePct" name="Importance (%)" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Terminal Training Logs */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Training & Convergence Stream Logs</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Backend Worker: PyTorch/Scikit Bridge</span>
        </div>

        <div className="font-mono text-xs text-slate-300 space-y-1.5 pt-2 max-h-36 overflow-y-auto">
          {state.trainingLogs.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-indigo-400 select-none">&gt;</span>
              <span className={log.includes('✓') ? 'text-emerald-400 font-bold' : ''}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
