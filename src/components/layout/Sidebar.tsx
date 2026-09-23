import React from 'react';
import {
  LayoutDashboard,
  Ship,
  Compass,
  Gauge,
  Cpu,
  Atom,
  Flame,
  Zap,
  BarChart3,
  FileText,
  Presentation,
  Sparkles,
  Layers,
  Shield,
  Wrench,
  ArrowRightLeft,
  Lock,
} from 'lucide-react';
import { NavigationTab, User } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: NavigationTab) => void;
  currentUser?: User | null;
  onOpenPitchDeck?: () => void;
  onOpenPresentation?: () => void;
  onOpenLogin?: () => void;
  onSwitchRole?: () => void;
  activeAlertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenPitchDeck,
  onOpenPresentation,
  onOpenLogin,
  onSwitchRole,
}) => {
  const handleOpenPitch = onOpenPitchDeck || onOpenPresentation || (() => {});
  const isOfficer = currentUser?.role === 'officer';

  const menuItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    highlight?: boolean;
    workerAllowed?: boolean;
    workerTag?: string;
  }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet Registry', icon: Ship, workerTag: 'Inspect' },
    { id: 'prediction', label: 'Fuel Predictor (AI)', icon: Gauge, badge: 'Physics AI' },
    { id: 'model', label: 'Model Training Lab', icon: Cpu, workerTag: 'Surrogate' },
    { id: 'optimization', label: 'Quantum Optimizer', icon: Atom, highlight: true },
    { id: 'scenarios', label: 'Fuel Decarbonization', icon: Flame },
    { id: 'shorepower', label: 'Shore Power (Cold Ironing)', icon: Zap, workerTag: 'Field Hookup' },
    { id: 'routes', label: 'Weather Corridors', icon: Compass },
    { id: 'analytics', label: 'ESG & Compliance', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            FS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight text-slate-900">FleetSafe</h1>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded font-bold font-mono">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Green Fleet Ops</p>
          </div>
        </div>
      </div>

      {/* Presentation Pitch Deck Action */}
      <div className="px-4 pt-4">
        <button
          onClick={handleOpenPitch}
          className="w-full bg-slate-900 text-white hover:bg-indigo-600 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-2">
            <Presentation className="w-4 h-4 text-indigo-200 group-hover:scale-105 transition-transform" />
            <span>Pitch Deck & Strategy</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">
          <span>Core Navigation</span>
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
              isOfficer ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'
            }`}
          >
            {isOfficer ? 'OFFICER' : 'WORKER'}
          </span>
        </div>

        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'text-indigo-600'
                      : 'text-slate-400 group-hover:text-indigo-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && !isActive && (
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold">
                  {item.badge}
                </span>
              )}

              {item.highlight && !isActive && (
                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md font-bold">
                  Quantum
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info / Operator Profile */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/90">
        {currentUser ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    isOfficer ? 'bg-indigo-600' : 'bg-teal-600'
                  }`}
                >
                  {currentUser.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{currentUser.rank}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
              <span
                className={`font-bold font-mono px-1.5 py-0.5 rounded ${
                  isOfficer
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-teal-100 text-teal-700'
                }`}
              >
                {currentUser.role.toUpperCase()}
              </span>

              {onSwitchRole && (
                <button
                  onClick={onSwitchRole}
                  className="text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRightLeft className="w-2.5 h-2.5" />
                  <span>Switch</span>
                </button>
              )}

              {onOpenLogin && (
                <button
                  onClick={onOpenLogin}
                  className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                >
                  Accounts
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold text-center transition-colors cursor-pointer"
          >
            Sign In / Select Role
          </button>
        )}
      </div>
    </aside>
  );
};

