import React, { useState } from 'react';
import {
  Shield,
  Wrench,
  KeyRound,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Ship,
  Zap,
  Atom,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { DEFAULT_USERS } from '../../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  currentUser: User | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regRank, setRegRank] = useState('');
  const [regDept, setRegDept] = useState('');

  if (!isOpen) return null;

  const officerPresets = DEFAULT_USERS.filter((u) => u.role === 'officer');
  const workerPresets = DEFAULT_USERS.filter((u) => u.role === 'worker');

  const handleQuickLogin = (user: User) => {
    setErrorMessage('');
    onLogin(user);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegisterMode) {
      if (!regName.trim() || !email.trim()) {
        setErrorMessage('Please provide full name and work email.');
        return;
      }
      const newUser: User = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: regName,
        email: email,
        role: selectedRole,
        rank: regRank || (selectedRole === 'officer' ? 'Operations Officer' : 'Field Technician'),
        department: regDept || (selectedRole === 'officer' ? 'Fleet Management' : 'Vessel Engineering'),
        avatar: regName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        badgeNumber: `FS-${selectedRole === 'officer' ? 'OFF' : 'WRK'}-${Math.floor(100 + Math.random() * 900)}`,
        lastLogin: 'Just now',
        permissions: {
          canEditFleet: selectedRole === 'officer',
          canRunQuantumOptimizer: selectedRole === 'officer',
          canTrainModels: selectedRole === 'officer',
          canManageRoutes: selectedRole === 'officer',
          canExportReports: true,
          canSubmitFieldLogs: true,
          canLogShorePower: true,
          canReportMaintenance: true,
        },
      };
      onLogin(newUser);
      onClose();
      return;
    }

    // Direct credentials check
    const matched = DEFAULT_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      onLogin(matched);
      onClose();
    } else if (email.trim()) {
      // Allow custom email login with auto-assigned role
      const customUser: User = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email.trim(),
        role: selectedRole,
        rank: selectedRole === 'officer' ? 'Fleet Officer' : 'Field Specialist',
        department: selectedRole === 'officer' ? 'Operations Division' : 'Engineering Crew',
        avatar: email.substring(0, 2).toUpperCase(),
        badgeNumber: `FS-${selectedRole === 'officer' ? 'OFF' : 'WRK'}-990`,
        lastLogin: 'Just now',
        permissions: {
          canEditFleet: selectedRole === 'officer',
          canRunQuantumOptimizer: selectedRole === 'officer',
          canTrainModels: selectedRole === 'officer',
          canManageRoutes: selectedRole === 'officer',
          canExportReports: true,
          canSubmitFieldLogs: true,
          canLogShorePower: true,
          canReportMaintenance: true,
        },
      };
      onLogin(customUser);
      onClose();
    } else {
      setErrorMessage('Please enter a valid email address or select a verified profile below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Shield className="w-48 h-48 text-indigo-400" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                FS
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">FleetSafe Identity & Access Portal</h2>
                <p className="text-xs text-slate-400">Select operational role to authenticate session permissions</p>
              </div>
            </div>
            {currentUser && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
              >
                ✕ Close
              </button>
            )}
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('officer');
                setErrorMessage('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                selectedRole === 'officer'
                  ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  selectedRole === 'officer' ? 'bg-white/20 text-white' : 'bg-slate-700 text-indigo-300'
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  Officer Access
                  {selectedRole === 'officer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Fleet Ops • Quantum Optimizer • AI Models
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('worker');
                setErrorMessage('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                selectedRole === 'worker'
                  ? 'bg-teal-600/90 border-teal-400 text-white shadow-md ring-2 ring-teal-400/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  selectedRole === 'worker' ? 'bg-white/20 text-white' : 'bg-slate-700 text-teal-300'
                }`}
              >
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  Worker Access
                  {selectedRole === 'worker' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Field Bunker Logging • Shore Power • Telemetry
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Preset Login Profile Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1-Click Verified {selectedRole === 'officer' ? 'Officer' : 'Worker'} Accounts
              </span>
              <span className="text-[11px] font-medium text-indigo-600">Instant Evaluation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(selectedRole === 'officer' ? officerPresets : workerPresets).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="group p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all flex items-start justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        user.role === 'officer'
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'bg-teal-100 text-teal-700 border border-teal-200'
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{user.rank}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{user.badgeNumber}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all mt-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest absolute">
              Or Sign In With Email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errorMessage}
              </div>
            )}

            {isRegisterMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Liam Vance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Rank / Position
                    </label>
                    <input
                      type="text"
                      value={regRank}
                      onChange={(e) => setRegRank(e.target.value)}
                      placeholder="e.g. 2nd Engineer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      placeholder="e.g. Engine Room"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Corporate / Maritime Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'officer'
                      ? 'alexander.vance@fleetsafe.com'
                      : 'elena.rostova@fleetsafe.com'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Access Key / Password
                </label>
                <span className="text-[10px] text-slate-400">Demo mode: any password</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMessage('');
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
              >
                {isRegisterMode ? (
                  <>← Existing Account</>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" /> Register New Personnel
                  </>
                )}
              </button>

              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
                  selectedRole === 'officer'
                    ? 'bg-indigo-600 hover:bg-indigo-500'
                    : 'bg-teal-600 hover:bg-teal-500'
                }`}
              >
                <span>{isRegisterMode ? 'Create & Authenticate' : 'Authorize Session'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Role Permissions Comparison Matrix */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              Role Authorization Scope Matrix
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="space-y-1.5 border-r border-slate-200 pr-2">
                <div className="font-bold text-indigo-700 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Officer Permissions:
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Full Quantum Optimizer
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Fleet Registry CRUD Operations
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Surrogate ML Model Retraining
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> IMO ESG & Carbon Tax Reports
                </div>
              </div>

              <div className="space-y-1.5 pl-1">
                <div className="font-bold text-teal-700 flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> Worker Permissions:
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" /> Real Bunker & Fuel Meter Logs
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" /> Port Shore Power Hookup Logs
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" /> Voyage Physics Fuel Predictor
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" /> Fleet Safety & Telemetry Reports
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
