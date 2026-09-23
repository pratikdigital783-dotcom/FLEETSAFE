import React from 'react';
import { Shield, Wrench, ArrowRightLeft, PlusCircle, FileText, CheckCircle2, Lock } from 'lucide-react';
import { User } from '../../types';

interface UserRoleBannerProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenWorkerLog: () => void;
  onSwitchRole: () => void;
}

export const UserRoleBanner: React.FC<UserRoleBannerProps> = ({
  currentUser,
  onOpenLogin,
  onOpenWorkerLog,
  onSwitchRole,
}) => {
  if (!currentUser) {
    return (
      <div className="bg-amber-500 text-slate-950 px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-xs">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-slate-950" />
          <span>Viewing in Public Preview Mode. Please authenticate as an Officer or Worker to enable full fleet telemetry operations.</span>
        </div>
        <button
          onClick={onOpenLogin}
          className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-3.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
        >
          Sign In / Select Role
        </button>
      </div>
    );
  }

  const isOfficer = currentUser.role === 'officer';

  return (
    <div
      className={`px-6 py-2.5 flex flex-wrap items-center justify-between text-xs transition-all border-b shadow-xs gap-3 ${
        isOfficer
          ? 'bg-indigo-950 text-indigo-100 border-indigo-900/60'
          : 'bg-teal-950 text-teal-100 border-teal-900/60'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isOfficer
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
          }`}
        >
          {isOfficer ? <Shield className="w-3.5 h-3.5 text-indigo-300" /> : <Wrench className="w-3.5 h-3.5 text-teal-300" />}
          <span>{isOfficer ? 'Officer Command Mode' : 'Worker Field Operations'}</span>
        </div>

        <div className="text-xs">
          <span className="font-bold text-white">{currentUser.name}</span>
          <span className="opacity-75 ml-1.5">({currentUser.rank})</span>
          {currentUser.assignedVesselName && (
            <span className="ml-2 font-mono text-[11px] opacity-90 text-emerald-300">
              • Station: {currentUser.assignedVesselName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {!isOfficer && (
          <button
            onClick={onOpenWorkerLog}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Log Fuel / Telemetry
          </button>
        )}

        <button
          onClick={onSwitchRole}
          className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Switch to alternate role"
        >
          <ArrowRightLeft className="w-3 h-3 text-slate-300" />
          <span>Switch to {isOfficer ? 'Worker' : 'Officer'}</span>
        </button>

        <button
          onClick={onOpenLogin}
          className="text-xs underline text-slate-300 hover:text-white px-1.5 cursor-pointer"
        >
          Profiles
        </button>
      </div>
    </div>
  );
};
