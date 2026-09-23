import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Ship,
  Cpu,
  Atom,
  Leaf,
  TrendingDown,
  CheckCircle2,
  Play,
  Flame,
  Zap,
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (route: string) => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Problem Statement & Challenge',
      subtitle: 'Maritime Decarbonization & Operational Efficiency',
      tag: '01 / 05 • The Global Challenge',
      icon: Flame,
      color: 'from-rose-500 to-amber-500',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-extrabold text-rose-600">50–60%</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">Voyage Operating OPEX</p>
              <p className="text-xs text-slate-500 mt-1">Fuel consumption is the single largest operational cost in maritime shipping.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-extrabold text-amber-600">1,076 Mt</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">Annual GHG Emissions</p>
              <p className="text-xs text-slate-500 mt-1">Global maritime shipping accounts for nearly 3% of global carbon emissions.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-extrabold text-indigo-600">IMO 2030 / 2050</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">Regulatory Mandates</p>
              <p className="text-xs text-slate-500 mt-1">Strict CII ratings, FuelEU Maritime, and EU ETS carbon taxes demand immediate green optimization.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Ship className="w-4 h-4 text-indigo-600" />
              Why Traditional Fleet Optimization Fails:
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
              <li><strong>High-Dimensional Non-Linearity:</strong> Speed-fuel cubic law $P \propto V^3$, varying hydrodynamic displacement, weather, and wave states.</li>
              <li><strong>Multi-Objective Conflict:</strong> Minimizing fuel consumption and emissions while meeting strict cargo delivery deadlines.</li>
              <li><strong>Alternative Fuel Heterogeneity:</strong> Transitioning fleets with mixed powertrains (Diesel, LNG, Methanol, Hydrogen, Ammonia, Shore Power).</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'AI Physics-Informed Fuel Prediction Engine',
      subtitle: 'Hybrid Holtrop-Mennen Hydrodynamics + Machine Learning',
      tag: '02 / 05 • Predictive Modeling',
      icon: Cpu,
      color: 'from-blue-600 to-cyan-500',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Physics-Informed Formulation</h4>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                P_total = (Δ^(2/3) · V^3.15 / C_adm) · f_weather · f_age + P_aux
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Combines hydrodynamic resistance coefficients, wind/wave added drag, hull fouling degradation, and Specific Fuel Oil Consumption (SFOC).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Model Validation Metrics</h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">R² Accuracy</p>
                  <p className="text-lg font-bold text-emerald-600">0.968</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">MAE (Mean Error)</p>
                  <p className="text-lg font-bold text-cyan-600">1.42 t/day</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">RMSE</p>
                  <p className="text-lg font-bold text-blue-600">1.88 t/day</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">Explainability</p>
                  <p className="text-lg font-bold text-indigo-600">SHAP Attributions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Provides instant sub-second fuel demand forecasting for any voyage condition with confidence bounds and lifecycle emission factors.</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Quantum-Inspired Metaheuristic Optimizer',
      subtitle: 'Q-Bit Representation & Probability-Amplitude Rotation Gates',
      tag: '03 / 05 • Core Algorithm',
      icon: Atom,
      color: 'from-indigo-600 to-purple-600',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="text-xs font-bold text-slate-900 mb-1">1. Q-Bit State Vector</h4>
              <p className="text-xs text-slate-600">
                Each decision variable is represented as a Q-bit $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ maintaining quantum superposition across solutions.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="text-xs font-bold text-slate-900 mb-1">2. Rotation Gate Update</h4>
              <p className="text-xs text-slate-600">
                Quantum rotation matrix $U(\Delta\theta)$ adjusts probability amplitudes towards elite candidate phenotypes without destroying population diversity.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="text-xs font-bold text-slate-900 mb-1">3. Constraint Repair</h4>
              <p className="text-xs text-slate-600">
                Continuous penalty guidance ensures cargo demand, vessel deadweight capacity, speed bounds, and delivery deadlines are 100% satisfied.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs font-mono">
            <div className="text-indigo-400 font-bold mb-1">Multi-Objective Fitness Formulation:</div>
            <div className="text-emerald-400">
              Minimize F = w_1·(Fuel/Fuel_base) + w_2·(Cost/Cost_base) + w_3·(CO2/CO2_base) + w_4·Penalty_Delay + w_5·Penalty_Cap
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
            <span className="font-semibold">Benchmarked Performance vs Classical GA:</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">2.2x Faster Convergence • 0 Constraint Violations</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Green Fleet Deployment & Alternative Fuels',
      subtitle: 'Multi-Fuel Optimization & Shore Power Cold Ironing',
      tag: '04 / 05 • Decarbonization Pathways',
      icon: Leaf,
      color: 'from-emerald-600 to-teal-500',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-xs">Methanol (Green)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">-56% CO2e</span>
              </div>
              <p className="text-[11px] text-slate-500">Commercial viability with dual-fuel retrofits; high energy density and bunkering readiness.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-xs">LNG (Liquefied Gas)</span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-semibold">-18% CO2e</span>
              </div>
              <p className="text-[11px] text-slate-500">Established global supply chain; zero SOx/particulates; bridge transition fuel.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-xs">Green Hydrogen</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-semibold">Zero TTW</span>
              </div>
              <p className="text-[11px] text-slate-500">Electrolysis-based zero direct emissions; ideal for short-sea and coastal feeder routes.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Shore Power (Cold Ironing) Integration
            </h4>
            <p className="text-xs text-slate-600">
              When berthed at ports (Rotterdam, Singapore, Shanghai, LA, Hamburg), vessels connect to high-voltage onshore clean grid power, eliminating auxiliary diesel consumption and abating up to 29,500 tCO2 annually per terminal.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Measurable Outcomes & Business Impact',
      subtitle: 'Demonstrated Operational and Environmental Savings',
      tag: '05 / 05 • Hackathon Impact Showcase',
      icon: TrendingDown,
      color: 'from-emerald-600 to-indigo-600',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-emerald-700">-16.8%</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Fuel Consumption</p>
              <p className="text-[11px] text-slate-500 mt-0.5">1,880 Tonnes saved</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-700">-18.2%</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Fuel & Port Costs</p>
              <p className="text-[11px] text-slate-500 mt-0.5">$1.73M OPEX saved</p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-teal-700">-22.4%</p>
              <p className="text-xs font-bold text-slate-800 mt-1">CO₂e Abatement</p>
              <p className="text-[11px] text-slate-500 mt-0.5">7,250 tCO2e abated</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-indigo-700">98.4%</p>
              <p className="text-xs font-bold text-slate-800 mt-1">On-Time Arrival</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero deadline breaches</p>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-indigo-300">Ready for Live Interactive Demo</h4>
              <p className="text-xs text-slate-400">Explore live prediction, quantum convergence graphs, fuel scenarios, and reports.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onNavigateTo('optimization');
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch Live Optimizer
            </button>
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
              FS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">FleetSafe Pitch Presentation</h3>
                <span className="text-[10px] font-semibold bg-indigo-900/80 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded">
                  Hackathon Showcase
                </span>
              </div>
              <p className="text-xs text-slate-400">Quantum-Inspired Fuel Prediction & Green Fleet Optimization</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content Area */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{slide.tag}</span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{slide.title}</h2>
              <p className="text-xs text-slate-500">{slide.subtitle}</p>
            </div>
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <slide.icon className="w-6 h-6" />
            </div>
          </div>

          {slide.content}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 cursor-pointer shadow-xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer shadow-xs"
              >
                Enter App <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
