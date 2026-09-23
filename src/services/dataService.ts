import { Vessel, MaritimeRoute, FleetAlert, ShorePowerPort, User, WorkerFieldLog } from '../types';
import { INITIAL_VESSELS, INITIAL_ROUTES, INITIAL_ALERTS, DEFAULT_USERS, INITIAL_WORKER_LOGS } from '../data/mockData';
import { FUEL_SPECIFICATIONS, SHORE_POWER_PORTS } from '../data/constants';

export class DataService {
  private static vesselsKey = 'fleetsafe_vessels_v2';
  private static routesKey = 'fleetsafe_routes_v2';
  private static alertsKey = 'fleetsafe_alerts_v2';
  private static userKey = 'fleetsafe_user_v2';
  private static usersListKey = 'fleetsafe_users_list_v2';
  private static workerLogsKey = 'fleetsafe_worker_logs_v2';

  // --- Auth & User State ---
  public static getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.usersListKey);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return DEFAULT_USERS;
  }

  public static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.usersListKey, JSON.stringify(users));
    } catch {
      // Ignore
    }
  }

  public static getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(this.userKey);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    // Default to Officer for quick out-of-the-box exploration
    return DEFAULT_USERS[0];
  }

  public static setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.userKey);
      }
    } catch {
      // Ignore
    }
  }

  public static logout(): void {
    this.setCurrentUser(null);
  }

  // --- Worker Field Logs ---
  public static getWorkerLogs(): WorkerFieldLog[] {
    try {
      const data = localStorage.getItem(this.workerLogsKey);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_WORKER_LOGS;
  }

  public static saveWorkerLogs(logs: WorkerFieldLog[]): void {
    try {
      localStorage.setItem(this.workerLogsKey, JSON.stringify(logs));
    } catch {
      // Ignore
    }
  }

  public static addWorkerLog(log: WorkerFieldLog): WorkerFieldLog[] {
    const current = this.getWorkerLogs();
    const updated = [log, ...current];
    this.saveWorkerLogs(updated);
    return updated;
  }


  public static getVessels(): Vessel[] {
    try {
      const data = localStorage.getItem(this.vesselsKey);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_VESSELS;
  }

  public static saveVessels(vessels: Vessel[]): void {
    try {
      localStorage.setItem(this.vesselsKey, JSON.stringify(vessels));
    } catch {
      // Ignore storage errors
    }
  }

  public static addVessel(vessel: Vessel): Vessel[] {
    const current = this.getVessels();
    const updated = [vessel, ...current];
    this.saveVessels(updated);
    return updated;
  }

  public static updateVessel(vessel: Vessel): Vessel[] {
    const current = this.getVessels();
    const updated = current.map((v) => (v.id === vessel.id ? vessel : v));
    this.saveVessels(updated);
    return updated;
  }

  public static deleteVessel(id: string): Vessel[] {
    const current = this.getVessels();
    const updated = current.filter((v) => v.id !== id);
    this.saveVessels(updated);
    return updated;
  }

  public static getRoutes(): MaritimeRoute[] {
    try {
      const data = localStorage.getItem(this.routesKey);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_ROUTES;
  }

  public static saveRoutes(routes: MaritimeRoute[]): void {
    try {
      localStorage.setItem(this.routesKey, JSON.stringify(routes));
    } catch {
      // Ignore
    }
  }

  public static getAlerts(): FleetAlert[] {
    try {
      const data = localStorage.getItem(this.alertsKey);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_ALERTS;
  }

  public static markAlertAsRead(id: string): FleetAlert[] {
    const alerts = this.getAlerts().map((a) => (a.id === id ? { ...a, read: true } : a));
    try {
      localStorage.setItem(this.alertsKey, JSON.stringify(alerts));
    } catch {
      // Ignore
    }
    return alerts;
  }

  public static resetToDemoData(): { vessels: Vessel[]; routes: MaritimeRoute[]; alerts: FleetAlert[] } {
    localStorage.removeItem(this.vesselsKey);
    localStorage.removeItem(this.routesKey);
    localStorage.removeItem(this.alertsKey);
    return {
      vessels: INITIAL_VESSELS,
      routes: INITIAL_ROUTES,
      alerts: INITIAL_ALERTS,
    };
  }

  public static getPorts(): ShorePowerPort[] {
    return SHORE_POWER_PORTS;
  }

  /**
   * Generates CSV strings for data export
   */
  public static exportCsv(type: 'vessels' | 'operations' | 'fuel_prices' | 'emission_factors'): string {
    if (type === 'vessels') {
      const vessels = this.getVessels();
      const headers = ['vessel_id', 'vessel_name', 'vessel_type', 'capacity', 'engine_power_kw', 'age_years', 'fuel_type', 'current_speed_knots', 'status', 'efficiency_grade'];
      const rows = vessels.map((v) => [
        v.id,
        `"${v.name}"`,
        v.type,
        v.capacity,
        v.enginePowerKw,
        v.ageYears,
        v.fuelType,
        v.currentSpeedKnots,
        v.status,
        v.efficiencyScore,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (type === 'operations') {
      const routes = this.getRoutes();
      const headers = ['route_id', 'route_name', 'origin', 'destination', 'distance_nm', 'cargo_demand', 'deadline_hours', 'weather_condition', 'wind_speed_knots', 'wave_height_m', 'assigned_vessel'];
      const rows = routes.map((r) => [
        r.id,
        `"${r.name}"`,
        `"${r.origin}"`,
        `"${r.destination}"`,
        r.distanceNm,
        r.cargoDemand,
        r.deadlineHours,
        r.weatherCondition,
        r.windSpeedKnots,
        r.waveHeightM,
        r.assignedVesselId,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (type === 'fuel_prices') {
      const headers = ['fuel_type', 'price_usd_per_tonne', 'energy_density_mj_kg', 'availability_score', 'readiness_tier'];
      const rows = Object.values(FUEL_SPECIFICATIONS).map((f) => [
        f.fuelType,
        f.pricePerTonneUsd,
        f.energyDensityMjKg,
        f.availabilityIndex,
        f.readinessTier,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (type === 'emission_factors') {
      const headers = ['fuel_type', 'operational_factor_tco2_per_t', 'lifecycle_factor_wtw_tco2_per_t', 'well_to_tank_tco2_per_t', 'tank_to_wake_tco2_per_t'];
      const rows = Object.values(FUEL_SPECIFICATIONS).map((f) => [
        f.fuelType,
        f.operationalEmissionFactor,
        f.lifecycleEmissionFactor,
        f.wttEmissionFactor,
        f.ttwEmissionFactor,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    return '';
  }

  public static exportFleetCsv(vessels?: Vessel[]): void {
    const list = vessels || this.getVessels();
    const headers = ['vessel_id', 'vessel_name', 'vessel_type', 'capacity', 'engine_power_kw', 'age_years', 'fuel_type', 'current_speed_knots', 'fuel_t_day', 'co2_t_day', 'status', 'efficiency_grade'];
    const rows = list.map((v) => [
      v.id,
      `"${v.name}"`,
      v.type,
      v.capacity,
      v.enginePowerKw,
      v.ageYears,
      v.fuelType,
      v.currentSpeedKnots,
      v.dailyFuelConsumptionTonnes,
      v.co2EmissionsTonnesPerDay,
      v.status,
      v.efficiencyScore,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    this.downloadFile(`FleetSafe_Fleet_Report_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  }

  public static downloadFile(filename: string, content: string, contentType = 'text/csv'): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
