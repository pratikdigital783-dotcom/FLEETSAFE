export type VesselType = 'Container Ship' | 'Bulk Carrier' | 'Tanker' | 'Ro-Ro' | 'General Cargo';

export type NavigationTab =
  | 'dashboard'
  | 'fleet'
  | 'vessel-detail'
  | 'prediction'
  | 'model'
  | 'optimization'
  | 'scenarios'
  | 'shorepower'
  | 'routes'
  | 'analytics';

export type FuelType = 'Marine Diesel' | 'LNG' | 'Methanol' | 'Hydrogen' | 'Ammonia';

export type VesselStatus = 'Active' | 'In Port' | 'Maintenance' | 'Anchored';

export type EfficiencyGrade = 'A+' | 'A' | 'B' | 'C' | 'D';

export interface Vessel {
  id: string;
  name: string;
  type: VesselType;
  capacity: number; // TEU for container, DWT (k tonnes) for others
  capacityUnit: string;
  enginePowerKw: number;
  ageYears: number;
  fuelType: FuelType;
  currentSpeedKnots: number;
  designSpeedKnots: number;
  currentRouteId: string;
  dailyFuelConsumptionTonnes: number;
  baselineDailyFuelTonnes: number;
  co2EmissionsTonnesPerDay: number;
  status: VesselStatus;
  efficiencyScore: EfficiencyGrade;
  efficiencyPercentage: number;
  shorePowerCapable: boolean;
  engineEfficiency: number; // 0.35 to 0.52
  coordinates: [number, number]; // lat, lng for stylized maritime map
  flag: string;
  imoNumber: string;
  yearBuilt: number;
}

export type WeatherCondition = 'Calm' | 'Moderate' | 'Rough Sea' | 'Storm Warning';

export interface MaritimeRoute {
  id: string;
  name: string;
  origin: string;
  originCoords: [number, number];
  destination: string;
  destCoords: [number, number];
  distanceNm: number; // Nautical Miles
  cargoDemand: number;
  cargoUnit: string;
  deadlineHours: number;
  weatherCondition: WeatherCondition;
  windSpeedKnots: number;
  waveHeightM: number;
  assignedVesselId: string;
  optimalSpeedKnots: number;
  recommendedFuel: FuelType;
  etaHours: number;
  status: 'On Schedule' | 'Optimized' | 'At Risk' | 'Delayed';
  waypoints: [number, number][];
}

export interface FuelSpecification {
  fuelType: FuelType;
  pricePerTonneUsd: number;
  energyDensityMjKg: number;
  operationalEmissionFactor: number; // tCO2e / tonne fuel
  lifecycleEmissionFactor: number; // tCO2e / tonne fuel (Well-to-Wake)
  wttEmissionFactor: number; // Well-to-Tank
  ttwEmissionFactor: number; // Tank-to-Wake
  availabilityIndex: number; // 0 to 100
  bunkeringCostUsd: number;
  readinessTier: 'Commercial' | 'Transitioning' | 'Pilot Stage' | 'R&D Emerging';
}

export interface ShorePowerPort {
  id: string;
  name: string;
  country: string;
  code: string;
  berthsWithShorePower: number;
  gridEmissionFactorGCo2Kwh: number;
  electricityCostUsdPerKwh: number;
  auxDieselSavingTonnesPerHour: number;
  berthUtilizationPct: number;
  recommendedStatus: 'Shore Power Recommended' | 'Conventional Auxiliary';
  annualCo2AbatedTonnes: number;
  avgBerthTimeHours: number;
}

export interface PredictionInputs {
  vesselType: VesselType;
  capacity: number;
  vesselAge: number;
  enginePowerKw: number;
  vesselSpeedKnots: number;
  distanceNm: number;
  cargoLoadPct: number;
  weatherCondition: WeatherCondition;
  windSpeedKnots: number;
  waveHeightM: number;
  seaCondition: 'Calm' | 'Moderate' | 'Rough' | 'Severe';
  fuelType: FuelType;
  engineEfficiency: number;
  shorePowerAvailable: boolean;
}

export interface PredictionResult {
  fuelConsumptionTonnes: number;
  fuelConsumptionPerDay: number;
  fuelCostUsd: number;
  co2eOperationalTonnes: number;
  co2eLifecycleTonnes: number;
  confidenceIndicatorPct: number;
  efficiencyScore: EfficiencyGrade;
  voyageDurationHours: number;
  breakdown: {
    hydrodynamicHullResistanceTonnes: number;
    weatherWindWaveResistanceTonnes: number;
    cargoDisplacementLoadTonnes: number;
    auxiliaryLoadTonnes: number;
    shorePowerSavedTonnes: number;
  };
  shapValues: {
    feature: string;
    contributionPct: number;
    impact: 'increase' | 'decrease' | 'neutral';
    value: string;
  }[];
}

export interface OptimizationWeights {
  fuelConsumption: number; // 0 - 100
  operationalCost: number; // 0 - 100
  co2Emissions: number; // 0 - 100
  scheduleReliability: number; // 0 - 100
}

export interface OptimizationConfig {
  populationSize: number;
  maxIterations: number;
  selectedVesselIds: string[];
  selectedRouteIds: string[];
  allowedFuels: FuelType[];
  minSpeedKnots: number;
  maxSpeedKnots: number;
  maxEmissionCapTonnes: number;
  fuelTargetCapTonnes: number;
  deliveryDeadlineHours: number;
  weights: OptimizationWeights;
  algorithm: 'QGA' | 'QPSO' | 'GA' | 'PSO' | 'SA' | 'Greedy';
  rotationStepTheta: number; // Quantum angle step (e.g., 0.05 * PI)
  mutationRate: number; // Quantum mutation probability
}

export interface VesselAssignment {
  vesselId: string;
  vesselName: string;
  vesselType: VesselType;
  routeId: string;
  routeName: string;
  assignedCargo: number;
  capacityUtilizationPct: number;
  speedKnots: number;
  fuelType: FuelType;
  predictedFuelTonnes: number;
  estimatedCostUsd: number;
  co2eTonnes: number;
  etaHours: number;
  deadlineHours: number;
  shorePowerUsed: boolean;
  status: 'Optimal' | 'Satisfied' | 'Near Margin' | 'Violation';
  violations: string[];
}

export interface ConstraintReport {
  cargoSatisfied: boolean;
  capacityValid: boolean;
  speedValid: boolean;
  emissionLimitSatisfied: boolean;
  deliveryScheduleSatisfied: boolean;
  shorePowerValid: boolean;
  overallCompliance: boolean;
  totalViolationsCount: number;
  violationDetails: string[];
}

export interface QuantumConvergencePoint {
  iteration: number;
  bestFitness: number;
  averageFitness: number;
  quantumEntropy: number; // Superposition entropy
  co2Trend: number;
  fuelTrend: number;
}

export interface QBitGeneState {
  geneIndex: number;
  name: string;
  alphaSq: number; // |alpha|^2 (Prob state 0)
  betaSq: number;  // |beta|^2 (Prob state 1)
  quantumPhase: number; // angle in radians
}

export interface OptimizationResult {
  algorithm: string;
  iterationsCompleted: number;
  executionTimeMs: number;
  bestFitness: number;
  baseline: {
    totalFuelTonnes: number;
    totalCostUsd: number;
    totalCo2eTonnes: number;
    scheduleReliabilityPct: number;
    averageCapacityUtilPct: number;
  };
  optimized: {
    totalFuelTonnes: number;
    totalCostUsd: number;
    totalCo2eTonnes: number;
    scheduleReliabilityPct: number;
    averageCapacityUtilPct: number;
  };
  improvements: {
    fuelSavingsTonnes: number;
    fuelReductionPct: number;
    costSavingsUsd: number;
    costReductionPct: number;
    emissionReductionTonnes: number;
    emissionReductionPct: number;
    reliabilityImprovementPct: number;
  };
  assignments: VesselAssignment[];
  convergenceHistory: QuantumConvergencePoint[];
  qbitStates: QBitGeneState[];
  constraintAudit: ConstraintReport;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  fuelPriceMultiplier: number;
  carbonTaxUsdPerTonne: number;
  cargoDemandMultiplier: number;
  speedLimitKnots: number;
  weatherSeverityMultiplier: number;
  shorePowerEnforced: boolean;
}

export interface ScenarioResultRow {
  fuelType: FuelType;
  fuelConsumptionTonnes: number;
  fuelCostUsd: number;
  carbonTaxCostUsd: number;
  totalCostUsd: number;
  operationalCo2eTonnes: number;
  lifecycleCo2eTonnes: number;
  availabilityIndex: number;
  operationalFeasibility: 'High' | 'Moderate' | 'Limited Infrastructure' | 'Experimental';
  overallScore: number;
}

export interface BenchmarkMetrics {
  algorithmId: string;
  name: string;
  category: 'Quantum-Inspired Metaheuristic' | 'Classical Metaheuristic' | 'Heuristic / Deterministic';
  bestObjectiveValue: number;
  fuelConsumptionTonnes: number;
  totalCostUsd: number;
  co2eTonnes: number;
  convergenceIterations: number;
  executionTimeMs: number;
  constraintViolations: number;
  scalabilityRating: string;
  solutionOptimalityScore: number;
}

export interface FleetAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  vesselId?: string;
  vesselName?: string;
  routeId?: string;
  timestamp: string;
  metric: string;
  read: boolean;
}

export type UserRole = 'officer' | 'worker';

export interface UserPermissions {
  canEditFleet: boolean;
  canRunQuantumOptimizer: boolean;
  canTrainModels: boolean;
  canManageRoutes: boolean;
  canExportReports: boolean;
  canSubmitFieldLogs: boolean;
  canLogShorePower: boolean;
  canReportMaintenance: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rank: string;
  department: string;
  avatar: string;
  badgeNumber: string;
  assignedVesselId?: string;
  assignedVesselName?: string;
  lastLogin: string;
  permissions: UserPermissions;
}

export interface WorkerFieldLog {
  id: string;
  timestamp: string;
  workerName: string;
  workerRole: string;
  workerId: string;
  vesselId: string;
  vesselName: string;
  category: 'Bunker Reading' | 'Shore Power Hookup' | 'Engine Telemetry' | 'Hull & Draft Check' | 'Maintenance Safety';
  fuelMeterTonnes?: number;
  engineRpm?: number;
  powerKw?: number;
  exhaustTempC?: number;
  draftMeters?: number;
  shorePowerConnected?: boolean;
  kwDelivered?: number;
  notes: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
}

export interface ModelTrainingState {
  datasetSize: number;
  trainingSamples: number;
  testingSamples: number;
  selectedModel: 'Random Forest (Ensemble)' | 'Gradient Boosting Regressor' | 'Quantum-Kernel Ridge' | 'Deep Multi-Layer Perceptron';
  isTraining: boolean;
  trainingProgressPct: number;
  currentEpoch: number;
  totalEpochs: number;
  metrics: {
    mae: number;
    rmse: number;
    mape: number;
    r2Score: number;
  };
  featureImportance: { feature: string; importancePct: number }[];
  actualVsPredicted: { actual: number; predicted: number; vessel: string }[];
  residualDistribution: { bin: string; count: number }[];
  trainingLogs: string[];
}
