import React, { useState } from 'react';
import {
  Bell,
  Search,
  Presentation,
  AlertTriangle,
  Info,
  X,
  Sparkles,
  ShieldCheck,
  Shield,
  Wrench,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ArrowRightLeft,
  PlusCircle,
  FileText,
  KeyRound,
} from 'lucide-react';
import { FleetAlert, NavigationTab, User, Vessel } from '../../types';

interface TopbarProps {
  currentTab: NavigationTab | string;
  alerts: FleetAlert[];
  currentUser: User | null;
  vessels?: Vessel[];
  onSelectVessel?: (v: Vessel) => void;
  onOpenPitchDeck?: () => void;
  onOpenPresentation?: () => void;
  onMarkAlertRead?: (id: string) => void;
  onOpenLogin: () => void;
  onOpenWorkerLog: () => void;
  onOpenLogsHistory: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Financial & Carbon Oversight', subtitle: 'Executive Fleet Intelligence' },
  fleet: { title: 'Fleet Registry & Telemetry', subtitle: 'Hydrodynamic Vessel Management' },
  'vessel-detail': { title: 'Vessel Digital Twin', subtitle: 'Hydrodynamics & Telemetry Curves' },
  prediction: { title: 'Physics AI Fuel Predictor', subtitle: 'Holtrop-Mennen ML Ensemble' },
  model: { title: 'Surrogate Model Lab', subtitle: 'XGBoost & Quantum-Ridge Benchmarking' },
  optimization: { title: 'Quantum Fleet Optimizer', subtitle: 'Multi-Objective Quantum Genetic Algorithm' },
  scenarios: { title: 'Decarbonization Pathways', subtitle: 'Alternative Fuels & Well-to-Wake Analysis' },
  shorepower: { title: 'Shore Power (Cold Ironing)', subtitle: 'Port Grid & Auxiliary Abatement' },
  routes: { title: 'Green Weather Corridors', subtitle: 'Isochrone & Wave Resistance Planning' },
  analytics: { title: 'ESG & Regulatory Compliance', subtitle: 'IMO DCS, EU ETS & CII Reporting' },
};

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  alerts,
  currentUser,
  vessels = [],
  onSelectVessel,
  onOpenPitchDeck,
  onOpenPresentation,
  onMarkAlertRead,
  onOpenLogin,
  onOpenWorkerLog,
  onOpenLogsHistory,
  onSwitchRole,
  onLogout,
}) => {
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const handleOpenPitch = onOpenPitchDeck || onOpenPresentation || (() => {});

  const currentMeta = TAB_TITLES[currentTab] || {
    title: 'Fleet Operations',
    subtitle: 'Institutional Fleet Oversight',
  };

  const unreadAlerts = alerts.filter((a) => !a.read);
  const isOfficer = currentUser?.role === 'officer';

  const filteredVessels = searchVal.trim()
    ? vessels.filter(
        (v) =>
          v.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          v.id.toLowerCase().includes(searchVal.toLowerCase()) ||
          v.type.toLowerCase().includes(searchVal.toLowerCase()) ||
          v.fuelType.toLowerCase().includes(searchVal.toLowerCase())
      )
    : [];

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 shadow-xs">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{currentMeta.title}</h1>
        <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-medium">
          {currentMeta.subtitle}
        </p>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search vessels, fuels..."
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchVal && (
            <button
              onClick={() => setSearchVal('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Dropdown */}
          {searchVal.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 max-h-60 overflow-y-auto">
              {filteredVessels.length === 0 ? (
                <p className="text-xs text-slate-400 px-3 py-2 text-center">No matching vessels</p>
              ) : (
                filteredVessels.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      if (onSelectVessel) onSelectVessel(v);
                      setSearchVal('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-indigo-50/70 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{v.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5 font-mono">{v.id}</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {v.fuelType}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Worker Telemetry Quick Action Button */}
        {currentUser?.role === 'worker' ? (
          <button
            onClick={onOpenWorkerLog}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Bunker / Telemetry</span>
          </button>
        ) : null}

        {/* Field Audit Logs Button */}
        <button
          onClick={onOpenLogsHistory}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          title="View worker telemetry audit records"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden xl:inline">Field Logs</span>
        </button>

        {/* Pitch Deck Action Button */}
        <button
          onClick={handleOpenPitch}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Presentation className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden lg:inline">Pitch Deck</span>
        </button>

        {/* Alerts Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsMenu(!showAlertsMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {showAlertsMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 z-50 animate-in fade-in-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-slate-900">Fleet Alerts & Telemetry</h4>
                  {unreadAlerts.length > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadAlerts.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowAlertsMenu(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active alerts.</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        alert.severity === 'critical'
                          ? 'bg-rose-50/70 border-rose-200'
                          : alert.severity === 'warning'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-indigo-50/70 border-indigo-200'
                      } ${alert.read ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {alert.severity === 'critical' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          ) : alert.severity === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          )}
                          <span className="text-slate-900">{alert.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{alert.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{alert.message}</p>
                      <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                        <span className="font-semibold text-[10px] text-slate-500 font-mono">
                          {alert.metric}
                        </span>
                        {!alert.read && onMarkAlertRead && (
                          <button
                            onClick={() => onMarkAlertRead(alert.id)}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Role Badge & Menu */}
        <div className="relative">
          {currentUser ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl border transition-all cursor-pointer ${
                isOfficer
                  ? 'bg-indigo-50/70 border-indigo-200 hover:border-indigo-300'
                  : 'bg-teal-50/70 border-teal-200 hover:border-teal-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                  isOfficer ? 'bg-indigo-600' : 'bg-teal-600'
                }`}
              >
                {currentUser.avatar}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono ${
                      isOfficer
                        ? 'bg-indigo-600 text-white'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">{currentUser.badgeNumber}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" /> Sign In
            </button>
          )}

          {/* User Account Dropdown Popup */}
          {showUserMenu && currentUser && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in-50 space-y-3">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm ${
                    isOfficer ? 'bg-indigo-600' : 'bg-teal-600'
                  }`}
                >
                  {currentUser.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.rank}</p>
                  <span
                    className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded font-mono mt-1 ${
                      isOfficer
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                  >
                    {currentUser.role === 'officer' ? 'Officer Role' : 'Worker Role'}
                  </span>
                </div>
              </div>

              {/* Station Info */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Badge ID:</span>
                  <span className="font-mono font-bold text-slate-800">{currentUser.badgeNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Department:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[130px]">{currentUser.department}</span>
                </div>
                {currentUser.assignedVesselName && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Station / Vessel:</span>
                    <span className="font-semibold text-emerald-700 truncate max-w-[130px]">
                      {currentUser.assignedVesselName}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSwitchRole();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" /> Switch to{' '}
                    {isOfficer ? 'Worker Mode' : 'Officer Mode'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenLogin();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" /> Switch Account / Re-login
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5 text-rose-500" /> Sign Out
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


