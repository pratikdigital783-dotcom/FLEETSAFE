import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  baseline?: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
  color?: 'emerald' | 'cyan' | 'blue' | 'indigo' | 'amber' | 'rose' | 'teal';
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  unit,
  baseline,
  change,
  changeType = 'neutral',
  icon: Icon,
  subtitle,
  color = 'indigo',
}) => {
  const iconBgMap = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
  };

  return (
    <div
      id={id}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300 relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
          <div className={`p-2.5 rounded-xl border ${iconBgMap[color] || iconBgMap.indigo}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2 flex items-baseline space-x-1.5">
          <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
          {unit && <span className="text-xs font-medium text-slate-500 font-mono">{unit}</span>}
        </div>
      </div>

      {(baseline !== undefined || change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {baseline !== undefined ? (
            <span className="text-slate-500 text-[11px]">
              Baseline: <span className="font-semibold text-slate-700 font-mono">{baseline}</span>
            </span>
          ) : (
            <span className="text-slate-500 text-[11px]">{subtitle}</span>
          )}

          {change && (
            <span
              className={`font-semibold px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 ${
                changeType === 'positive'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : changeType === 'negative'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const StatusBadge: React.FC<{ status: string; id?: string }> = ({ status, id }) => {
  const getStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
      case 'on schedule':
      case 'optimal':
      case 'satisfied':
      case 'recommended':
      case 'shore power recommended':
      case 'commercial':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in port':
      case 'optimized':
      case 'transitioning':
      case 'moderate':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'at risk':
      case 'near margin':
      case 'pilot stage':
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'delayed':
      case 'violation':
      case 'maintenance':
      case 'critical':
      case 'r&d emerging':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${getStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export const EfficiencyBadge: React.FC<{ grade: string; id?: string }> = ({ grade, id }) => {
  const map: Record<string, string> = {
    'A+': 'bg-emerald-600 text-white',
    A: 'bg-emerald-500 text-white',
    B: 'bg-indigo-600 text-white',
    C: 'bg-amber-500 text-white',
    D: 'bg-rose-500 text-white',
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center justify-center font-bold text-xs px-2.5 py-0.5 rounded-md font-mono ${
        map[grade] || 'bg-slate-500 text-white'
      }`}
    >
      {grade}
    </span>
  );
};

export const DemoTag: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider ${className}`}
  >
    Demo Simulation
  </span>
);

