import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { PresentationModal } from './components/layout/PresentationModal';
import { LoginModal } from './components/auth/LoginModal';
import { WorkerFieldLogModal } from './components/auth/WorkerFieldLogModal';
import { WorkerLogsListModal } from './components/auth/WorkerLogsListModal';
import { UserRoleBanner } from './components/auth/UserRoleBanner';
import { DashboardPage } from './pages/DashboardPage';
import { FleetPage } from './pages/FleetPage';
import { VesselDetailPage } from './pages/VesselDetailPage';
import { PredictionPage } from './pages/PredictionPage';
import { ModelTrainingPage } from './pages/ModelTrainingPage';
import { OptimizationPage } from './pages/OptimizationPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ShorePowerPage } from './pages/ShorePowerPage';
import { RoutesPage } from './pages/RoutesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Vessel, MaritimeRoute, NavigationTab, FleetAlert, User, WorkerFieldLog } from './types';
import { DataService } from './services/dataService';
import { INITIAL_ALERTS, DEFAULT_USERS } from './data/mockData';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [vessels, setVessels] = useState<Vessel[]>(() => DataService.getVessels());
  const [routes, setRoutes] = useState<MaritimeRoute[]>(() => DataService.getRoutes());
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [predictionVessel, setPredictionVessel] = useState<Vessel | null>(null);
  const [predictionRoute, setPredictionRoute] = useState<MaritimeRoute | null>(null);
  const [alerts, setAlerts] = useState<FleetAlert[]>(() => DataService.getAlerts());
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);

  // Auth & Role State
  const [currentUser, setCurrentUser] = useState<User | null>(() => DataService.getCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isWorkerLogModalOpen, setIsWorkerLogModalOpen] = useState<boolean>(false);
  const [isWorkerLogsListOpen, setIsWorkerLogsListOpen] = useState<boolean>(false);
  const [workerLogs, setWorkerLogs] = useState<WorkerFieldLog[]>(() => DataService.getWorkerLogs());

  // Sync to localStorage
  useEffect(() => {
    DataService.saveVessels(vessels);
  }, [vessels]);

  useEffect(() => {
    DataService.saveRoutes(routes);
  }, [routes]);

  useEffect(() => {
    DataService.setCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    DataService.saveWorkerLogs(workerLogs);
  }, [workerLogs]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const roleAlert: FleetAlert = {
      id: `ALT-AUTH-${Date.now()}`,
      severity: 'info',
      title: `${user.role === 'officer' ? 'Officer' : 'Worker'} Session Authorized`,
      message: `${user.name} (${user.rank}) authenticated with ${user.role} privileges.`,
      timestamp: 'Just now',
      metric: `Badge: ${user.badgeNumber}`,
      read: false,
    };
    setAlerts((prev) => [roleAlert, ...prev]);
  };

  const handleLogout = () => {
    DataService.logout();
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const handleSwitchRole = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    if (currentUser.role === 'officer') {
      // Switch to default worker profile
      const workerUser = DEFAULT_USERS.find((u) => u.role === 'worker') || DEFAULT_USERS[2];
      setCurrentUser(workerUser);
    } else {
      // Switch to default officer profile
      const officerUser = DEFAULT_USERS.find((u) => u.role === 'officer') || DEFAULT_USERS[0];
      setCurrentUser(officerUser);
    }
  };

  // Worker Log Submission Handler
  const handleSubmitWorkerLog = (log: WorkerFieldLog, updatedVessel?: Vessel) => {
    setWorkerLogs((prev) => [log, ...prev]);
    if (updatedVessel) {
      handleUpdateVessel(updatedVessel);
    }

    // Dispatch Fleet Alert
    const logAlert: FleetAlert = {
      id: `ALT-WRK-${Date.now()}`,
      vesselId: log.vesselId,
      vesselName: log.vesselName,
      severity: log.category === 'Maintenance Safety' ? 'warning' : 'info',
      title: `Field Log: ${log.category}`,
      message: `${log.workerName} (${log.workerRole}) submitted telemetry for ${log.vesselName}. ${log.notes.slice(0, 70)}...`,
      timestamp: 'Just now',
      metric: log.fuelMeterTonnes
        ? `${log.fuelMeterTonnes} t fuel`
        : log.kwDelivered
        ? `${log.kwDelivered} kW grid`
        : 'Telemetry Synced',
      read: false,
    };
    setAlerts((prev) => [logAlert, ...prev]);
  };

  // Handlers
  const handleAddVessel = (newVessel: Vessel) => {
    setVessels((prev) => [newVessel, ...prev]);
    const newAlert: FleetAlert = {
      id: `ALT-${Date.now()}`,
      vesselId: newVessel.id,
      vesselName: newVessel.name,
      severity: 'info',
      title: 'New Vessel Registered',
      message: `New vessel ${newVessel.name} registered into active fleet registry.`,
      timestamp: 'Just now',
      metric: `${newVessel.fuelType} • ${newVessel.capacity} ${newVessel.capacityUnit}`,
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleUpdateVessel = (updatedVessel: Vessel) => {
    setVessels((prev) => prev.map((v) => (v.id === updatedVessel.id ? updatedVessel : v)));
    if (selectedVessel?.id === updatedVessel.id) {
      setSelectedVessel(updatedVessel);
    }
  };

  const handleDeleteVessel = (id: string) => {
    setVessels((prev) => prev.filter((v) => v.id !== id));
    if (selectedVessel?.id === id) {
      setSelectedVessel(null);
      setCurrentTab('fleet');
    }
  };

  const handleSelectVesselDetail = (v: Vessel) => {
    setSelectedVessel(v);
    setCurrentTab('vessel-detail');
  };

  const handleNavigateToPrediction = (v?: Vessel | null) => {
    if (v) {
      setPredictionVessel(v);
    }
    setCurrentTab('prediction');
  };

  const handleMarkAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        currentUser={currentUser}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar
          currentTab={currentTab}
          alerts={alerts}
          currentUser={currentUser}
          vessels={vessels}
          onSelectVessel={handleSelectVesselDetail}
          onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
          onMarkAlertRead={handleMarkAlertRead}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenWorkerLog={() => setIsWorkerLogModalOpen(true)}
          onOpenLogsHistory={() => setIsWorkerLogsListOpen(true)}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
        />

        {/* Operational Role Context Banner */}
        <UserRoleBanner
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenWorkerLog={() => setIsWorkerLogModalOpen(true)}
          onSwitchRole={handleSwitchRole}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 pb-12">
          {currentTab === 'dashboard' && (
            <DashboardPage
              vessels={vessels}
              routes={routes}
              onNavigate={(tab) => setCurrentTab(tab as NavigationTab)}
              onSelectVessel={handleSelectVesselDetail}
            />
          )}

          {currentTab === 'fleet' && (
            <FleetPage
              vessels={vessels}
              currentUser={currentUser}
              onAddVessel={handleAddVessel}
              onUpdateVessel={handleUpdateVessel}
              onDeleteVessel={handleDeleteVessel}
              onSelectVesselDetail={handleSelectVesselDetail}
              onOpenWorkerLog={() => setIsWorkerLogModalOpen(true)}
            />
          )}

          {currentTab === 'vessel-detail' && selectedVessel && (
            <VesselDetailPage
              vessel={selectedVessel}
              routes={routes}
              onBack={() => setCurrentTab('fleet')}
              onNavigateToPrediction={handleNavigateToPrediction}
            />
          )}

          {currentTab === 'prediction' && (
            <PredictionPage
              vessels={vessels}
              initialVessel={predictionVessel}
              initialRoute={predictionRoute}
            />
          )}

          {currentTab === 'model' && <ModelTrainingPage />}

          {currentTab === 'optimization' && (
            <OptimizationPage
              vessels={vessels}
              routes={routes}
            />
          )}

          {currentTab === 'scenarios' && <ScenariosPage />}

          {currentTab === 'shorepower' && <ShorePowerPage />}

          {currentTab === 'routes' && (
            <RoutesPage
              routes={routes}
              onSelectRouteForPrediction={(r) => {
                setPredictionRoute(r);
                setCurrentTab('prediction');
              }}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage
              vessels={vessels}
              routes={routes}
            />
          )}
        </main>
      </div>

      {/* Hackathon Pitch Deck & Technical Documentation Modal */}
      <PresentationModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      {/* Authentication & Role Selection Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />

      {/* Worker Field Telemetry & Bunker Log Modal */}
      {currentUser && (
        <WorkerFieldLogModal
          isOpen={isWorkerLogModalOpen}
          onClose={() => setIsWorkerLogModalOpen(false)}
          vessels={vessels}
          currentUser={currentUser}
          onSubmitLog={handleSubmitWorkerLog}
        />
      )}

      {/* Worker Field Logs Audit Trail Modal */}
      <WorkerLogsListModal
        isOpen={isWorkerLogsListOpen}
        onClose={() => setIsWorkerLogsListOpen(false)}
        logs={workerLogs}
        onOpenNewLog={() => setIsWorkerLogModalOpen(true)}
        canCreateLog={!!currentUser}
      />
    </div>
  );
}

export default App;

