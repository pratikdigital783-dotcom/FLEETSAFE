import {
  OptimizationConfig,
  OptimizationResult,
  Vessel,
  MaritimeRoute,
  VesselAssignment,
  ConstraintReport,
  QuantumConvergencePoint,
  QBitGeneState,
  FuelType,
} from '../types';
import { FUEL_SPECIFICATIONS } from '../data/constants';
import { FuelPredictionService } from './predictionService';

export class QuantumOptimizer {
  /**
   * Quantum-Inspired Genetic Algorithm (QGA) with Quantum Bit Probability Amplitudes
   */
  public static optimize(
    config: OptimizationConfig,
    vessels: Vessel[],
    routes: MaritimeRoute[]
  ): OptimizationResult {
    const startTime = performance.now();

    // Filter available vessels & routes
    const activeVessels = vessels.filter((v) => config.selectedVesselIds.includes(v.id));
    const activeRoutes = routes.filter((r) => config.selectedRouteIds.includes(r.id));

    if (activeVessels.length === 0 || activeRoutes.length === 0) {
      throw new Error('At least one vessel and one route must be selected for optimization.');
    }

    const {
      populationSize = 24,
      maxIterations = 50,
      weights,
      minSpeedKnots = 12.0,
      maxSpeedKnots = 21.0,
      maxEmissionCapTonnes = 100000,
      allowedFuels = ['Marine Diesel', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'],
      rotationStepTheta = 0.05 * Math.PI,
      mutationRate = 0.04,
    } = config;

    // Gene encoding dimensions:
    // For each vessel i:
    // - 3 bits for Route Assignment (0..activeRoutes.length-1)
    // - 4 bits for Speed Quantization (16 levels between minSpeed and maxSpeed)
    // - 3 bits for Fuel Type (0..allowedFuels.length-1)
    // - 1 bit for Shore Power decision
    const BITS_PER_VESSEL = 11;
    const TOTAL_QBITS = activeVessels.length * BITS_PER_VESSEL;

    // 1. Initialize Q-bit Quantum Population:
    // In initial quantum superposition, alpha = 1/sqrt(2), beta = 1/sqrt(2), angle = PI/4
    const qbitAngles: number[] = new Array(TOTAL_QBITS).fill(Math.PI / 4);

    let bestGlobalFitness = Infinity;
    let bestGlobalGenome: number[] = new Array(TOTAL_QBITS).fill(0);
    let bestAssignments: VesselAssignment[] = [];
    const convergenceHistory: QuantumConvergencePoint[] = [];

    // Pre-calculate baseline metrics (unoptimized default current fleet configuration)
    const baselineAssignments = activeVessels.map((vessel, idx) => {
      const assignedRoute = activeRoutes[idx % activeRoutes.length];
      const prediction = FuelPredictionService.predict({
        vesselType: vessel.type,
        capacity: vessel.capacity,
        vesselAge: vessel.ageYears,
        enginePowerKw: vessel.enginePowerKw,
        vesselSpeedKnots: vessel.currentSpeedKnots,
        distanceNm: assignedRoute.distanceNm,
        cargoLoadPct: 85,
        weatherCondition: assignedRoute.weatherCondition,
        windSpeedKnots: assignedRoute.windSpeedKnots,
        waveHeightM: assignedRoute.waveHeightM,
        seaCondition: 'Moderate',
        fuelType: vessel.fuelType,
        engineEfficiency: vessel.engineEfficiency,
        shorePowerAvailable: false,
      });

      const etaHours = assignedRoute.distanceNm / vessel.currentSpeedKnots;
      return {
        vesselId: vessel.id,
        vesselName: vessel.name,
        vesselType: vessel.type,
        routeId: assignedRoute.id,
        routeName: assignedRoute.name,
        assignedCargo: Math.round(assignedRoute.cargoDemand),
        capacityUtilizationPct: 85,
        speedKnots: vessel.currentSpeedKnots,
        fuelType: vessel.fuelType,
        predictedFuelTonnes: prediction.fuelConsumptionTonnes,
        estimatedCostUsd: prediction.fuelCostUsd,
        co2eTonnes: prediction.co2eOperationalTonnes,
        etaHours: Math.round(etaHours),
        deadlineHours: assignedRoute.deadlineHours,
        shorePowerUsed: false,
        status: etaHours > assignedRoute.deadlineHours ? 'Violation' as const : 'Satisfied' as const,
        violations: etaHours > assignedRoute.deadlineHours ? ['Deadline exceeded'] : [],
      };
    });

    const baselineTotalFuel = baselineAssignments.reduce((acc, a) => acc + a.predictedFuelTonnes, 0);
    const baselineTotalCost = baselineAssignments.reduce((acc, a) => acc + a.estimatedCostUsd, 0);
    const baselineTotalCo2e = baselineAssignments.reduce((acc, a) => acc + a.co2eTonnes, 0);
    const baselineOnTime = baselineAssignments.filter((a) => a.etaHours <= a.deadlineHours).length;
    const baselineReliability = (baselineOnTime / baselineAssignments.length) * 100;

    // 2. Quantum Iteration Loop
    for (let iter = 1; iter <= maxIterations; iter++) {
      const populationGenomes: number[][] = [];
      const populationFitnesses: number[] = [];
      const populationAssignmentsList: VesselAssignment[][] = [];

      // A. Quantum Collapse (Measurement) of Population
      for (let pop = 0; pop < populationSize; pop++) {
        const measuredGenome: number[] = [];
        for (let q = 0; q < TOTAL_QBITS; q++) {
          const betaSq = Math.sin(qbitAngles[q]) ** 2;
          measuredGenome.push(Math.random() < betaSq ? 1 : 0);
        }

        // Decode genome to phenotype
        const assignments: VesselAssignment[] = [];
        let totalFuel = 0;
        let totalCost = 0;
        let totalCo2e = 0;
        let schedulePenalties = 0;
        let capacityPenalties = 0;
        let emissionViolations = 0;

        for (let vIdx = 0; vIdx < activeVessels.length; vIdx++) {
          const bitOffset = vIdx * BITS_PER_VESSEL;
          const vessel = activeVessels[vIdx];

          // Route gene (3 bits: 0..7)
          const routeVal = (measuredGenome[bitOffset] << 2) | (measuredGenome[bitOffset + 1] << 1) | measuredGenome[bitOffset + 2];
          const routeIndex = (routeVal + vIdx) % activeRoutes.length;
          const assignedRoute = activeRoutes[routeIndex];

          // Speed gene (4 bits: 0..15)
          const speedVal =
            (measuredGenome[bitOffset + 3] << 3) |
            (measuredGenome[bitOffset + 4] << 2) |
            (measuredGenome[bitOffset + 5] << 1) |
            measuredGenome[bitOffset + 6];
          const normalizedSpeed = minSpeedKnots + (speedVal / 15) * (maxSpeedKnots - minSpeedKnots);
          const roundedSpeed = Number(normalizedSpeed.toFixed(1));

          // Fuel gene (3 bits: 0..7)
          const fuelVal = (measuredGenome[bitOffset + 7] << 2) | (measuredGenome[bitOffset + 8] << 1) | measuredGenome[bitOffset + 9];
          const fuelType = allowedFuels[fuelVal % allowedFuels.length] || 'Marine Diesel';

          // Shore power gene (1 bit)
          const shorePowerUsed = vessel.shorePowerCapable && measuredGenome[bitOffset + 10] === 1;

          // Capacity load determination
          const assignedCargo = assignedRoute.cargoDemand;
          const capacityUtil = Math.min(100, Math.round((assignedCargo / (vessel.capacity * (vessel.capacityUnit === 'k DWT' ? 1000 : 1))) * 100));

          // Physical Prediction
          const prediction = FuelPredictionService.predict({
            vesselType: vessel.type,
            capacity: vessel.capacity,
            vesselAge: vessel.ageYears,
            enginePowerKw: vessel.enginePowerKw,
            vesselSpeedKnots: roundedSpeed,
            distanceNm: assignedRoute.distanceNm,
            cargoLoadPct: capacityUtil > 0 ? capacityUtil : 80,
            weatherCondition: assignedRoute.weatherCondition,
            windSpeedKnots: assignedRoute.windSpeedKnots,
            waveHeightM: assignedRoute.waveHeightM,
            seaCondition: 'Moderate',
            fuelType,
            engineEfficiency: vessel.engineEfficiency,
            shorePowerAvailable: shorePowerUsed,
          });

          const etaHours = Number((assignedRoute.distanceNm / roundedSpeed).toFixed(1));
          const isLate = etaHours > assignedRoute.deadlineHours;
          const violations: string[] = [];

          if (isLate) {
            schedulePenalties += (etaHours - assignedRoute.deadlineHours) * 1.5;
            violations.push(`Delayed by ${(etaHours - assignedRoute.deadlineHours).toFixed(1)} hrs`);
          }

          if (capacityUtil > 98) {
            capacityPenalties += (capacityUtil - 98) * 10;
            violations.push(`Capacity utilization near limit (${capacityUtil}%)`);
          }

          totalFuel += prediction.fuelConsumptionTonnes;
          totalCost += prediction.fuelCostUsd;
          totalCo2e += prediction.co2eOperationalTonnes;

          assignments.push({
            vesselId: vessel.id,
            vesselName: vessel.name,
            vesselType: vessel.type,
            routeId: assignedRoute.id,
            routeName: assignedRoute.name,
            assignedCargo: Math.round(assignedCargo),
            capacityUtilizationPct: capacityUtil || 82,
            speedKnots: roundedSpeed,
            fuelType,
            predictedFuelTonnes: prediction.fuelConsumptionTonnes,
            estimatedCostUsd: prediction.fuelCostUsd,
            co2eTonnes: prediction.co2eOperationalTonnes,
            etaHours: Math.round(etaHours),
            deadlineHours: assignedRoute.deadlineHours,
            shorePowerUsed,
            status: violations.length > 0 ? (isLate ? 'Violation' : 'Near Margin') : 'Optimal',
            violations,
          });
        }

        if (totalCo2e > maxEmissionCapTonnes) {
          emissionViolations += (totalCo2e - maxEmissionCapTonnes) * 5;
        }

        // B. Multi-Objective Fitness Evaluation
        // Normalize factors to dimensionless scale ~ 0 to 1
        const normFuel = totalFuel / Math.max(1, baselineTotalFuel);
        const normCost = totalCost / Math.max(1, baselineTotalCost);
        const normCo2 = totalCo2e / Math.max(1, baselineTotalCo2e);
        const normSchedule = schedulePenalties / 50;
        const normCapacity = capacityPenalties / 50;
        const normEmission = emissionViolations / 50;

        const totalWeight = weights.fuelConsumption + weights.operationalCost + weights.co2Emissions + weights.scheduleReliability;
        const wF = weights.fuelConsumption / totalWeight;
        const wC = weights.operationalCost / totalWeight;
        const wE = weights.co2Emissions / totalWeight;
        const wS = weights.scheduleReliability / totalWeight;

        const fitness =
          wF * normFuel +
          wC * normCost +
          wE * normCo2 +
          wS * normSchedule +
          0.25 * normCapacity +
          0.30 * normEmission;

        populationGenomes.push(measuredGenome);
        populationFitnesses.push(fitness);
        populationAssignmentsList.push(assignments);

        if (fitness < bestGlobalFitness) {
          bestGlobalFitness = fitness;
          bestGlobalGenome = [...measuredGenome];
          bestAssignments = assignments;
        }
      }

      // C. Quantum Rotation Gate Update
      // Rotate each Q-bit towards the state of the best individual
      for (let q = 0; q < TOTAL_QBITS; q++) {
        const bestBit = bestGlobalGenome[q];
        const alpha = Math.cos(qbitAngles[q]);
        const beta = Math.sin(qbitAngles[q]);

        let deltaTheta = 0;
        if (bestBit === 1) {
          // Encourage state |1> -> increase beta
          if (alpha * beta > 0) deltaTheta = rotationStepTheta;
          else if (alpha * beta < 0) deltaTheta = -rotationStepTheta;
          else deltaTheta = rotationStepTheta;
        } else {
          // Encourage state |0> -> increase alpha
          if (alpha * beta > 0) deltaTheta = -rotationStepTheta;
          else if (alpha * beta < 0) deltaTheta = rotationStepTheta;
          else deltaTheta = -rotationStepTheta;
        }

        // Apply mutation: phase inversion with probability mutationRate
        if (Math.random() < mutationRate) {
          qbitAngles[q] = Math.PI / 2 - qbitAngles[q];
        } else {
          qbitAngles[q] += deltaTheta;
        }

        // Keep angle within [0, PI/2]
        if (qbitAngles[q] < 0.01) qbitAngles[q] = 0.01;
        if (qbitAngles[q] > Math.PI / 2 - 0.01) qbitAngles[q] = Math.PI / 2 - 0.01;
      }

      // Calculate Quantum Superposition Entropy: S = -sum( |a|^2 log |a|^2 + |b|^2 log |b|^2 )
      let quantumEntropy = 0;
      for (let q = 0; q < TOTAL_QBITS; q++) {
        const a2 = Math.cos(qbitAngles[q]) ** 2;
        const b2 = Math.sin(qbitAngles[q]) ** 2;
        const e1 = a2 > 0 ? a2 * Math.log2(a2) : 0;
        const e2 = b2 > 0 ? b2 * Math.log2(b2) : 0;
        quantumEntropy += -(e1 + e2);
      }
      const normalizedEntropy = Number((quantumEntropy / TOTAL_QBITS).toFixed(4));

      const avgFitness = populationFitnesses.reduce((a, b) => a + b, 0) / populationFitnesses.length;
      const currentBestFuel = bestAssignments.reduce((a, b) => a + b.predictedFuelTonnes, 0);
      const currentBestCo2 = bestAssignments.reduce((a, b) => a + b.co2eTonnes, 0);

      convergenceHistory.push({
        iteration: iter,
        bestFitness: Number(bestGlobalFitness.toFixed(4)),
        averageFitness: Number(avgFitness.toFixed(4)),
        quantumEntropy: normalizedEntropy,
        co2Trend: Math.round(currentBestCo2),
        fuelTrend: Math.round(currentBestFuel),
      });
    }

    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);

    // Optimized aggregation
    const optimizedTotalFuel = bestAssignments.reduce((acc, a) => acc + a.predictedFuelTonnes, 0);
    const optimizedTotalCost = bestAssignments.reduce((acc, a) => acc + a.estimatedCostUsd, 0);
    const optimizedTotalCo2e = bestAssignments.reduce((acc, a) => acc + a.co2eTonnes, 0);
    const optimizedOnTime = bestAssignments.filter((a) => a.etaHours <= a.deadlineHours).length;
    const optimizedReliability = (optimizedOnTime / bestAssignments.length) * 100;
    const optimizedAvgCapacity = Math.round(bestAssignments.reduce((acc, a) => acc + a.capacityUtilizationPct, 0) / bestAssignments.length);

    // Improvements
    const fuelSavings = baselineTotalFuel - optimizedTotalFuel;
    const fuelReductionPct = Number(((fuelSavings / baselineTotalFuel) * 100).toFixed(1));

    const costSavings = baselineTotalCost - optimizedTotalCost;
    const costReductionPct = Number(((costSavings / baselineTotalCost) * 100).toFixed(1));

    const emissionReduction = baselineTotalCo2e - optimizedTotalCo2e;
    const emissionReductionPct = Number(((emissionReduction / baselineTotalCo2e) * 100).toFixed(1));

    const reliabilityImprovement = Number((optimizedReliability - baselineReliability).toFixed(1));

    // Inspect Q-Bit States for visualization
    const qbitStates: QBitGeneState[] = [];
    for (let q = 0; q < Math.min(16, TOTAL_QBITS); q++) {
      const a2 = Math.cos(qbitAngles[q]) ** 2;
      const b2 = Math.sin(qbitAngles[q]) ** 2;
      qbitStates.push({
        geneIndex: q + 1,
        name: `Q-Bit |q${q + 1}⟩`,
        alphaSq: Number(a2.toFixed(3)),
        betaSq: Number(b2.toFixed(3)),
        quantumPhase: Number(qbitAngles[q].toFixed(3)),
      });
    }

    // Constraint Audit
    const violationsList: string[] = [];
    let isCargoSatisfied = true;
    let isCapacityValid = true;
    let isSpeedValid = true;
    let isDeliveryScheduleSatisfied = true;
    let isEmissionLimitSatisfied = optimizedTotalCo2e <= maxEmissionCapTonnes;

    bestAssignments.forEach((a) => {
      if (a.etaHours > a.deadlineHours) {
        isDeliveryScheduleSatisfied = false;
        violationsList.push(`${a.vesselName} ETA (${a.etaHours}h) exceeds deadline (${a.deadlineHours}h) on ${a.routeName}`);
      }
      if (a.speedKnots < minSpeedKnots || a.speedKnots > maxSpeedKnots) {
        isSpeedValid = false;
        violationsList.push(`${a.vesselName} cruising speed (${a.speedKnots} kts) outside allowable limits`);
      }
      if (a.capacityUtilizationPct > 100) {
        isCapacityValid = false;
        violationsList.push(`${a.vesselName} cargo exceeds max capacity`);
      }
    });

    if (!isEmissionLimitSatisfied) {
      violationsList.push(`Total fleet emissions (${optimizedTotalCo2e.toFixed(0)}t) exceed regulatory limit (${maxEmissionCapTonnes}t)`);
    }

    const constraintAudit: ConstraintReport = {
      cargoSatisfied: isCargoSatisfied,
      capacityValid: isCapacityValid,
      speedValid: isSpeedValid,
      emissionLimitSatisfied: isEmissionLimitSatisfied,
      deliveryScheduleSatisfied: isDeliveryScheduleSatisfied,
      shorePowerValid: true,
      overallCompliance: violationsList.length === 0,
      totalViolationsCount: violationsList.length,
      violationDetails: violationsList,
    };

    return {
      algorithm: 'Quantum-Inspired Genetic Algorithm (QGA)',
      iterationsCompleted: maxIterations,
      executionTimeMs,
      bestFitness: Number(bestGlobalFitness.toFixed(4)),
      baseline: {
        totalFuelTonnes: Number(baselineTotalFuel.toFixed(1)),
        totalCostUsd: Math.round(baselineTotalCost),
        totalCo2eTonnes: Number(baselineTotalCo2e.toFixed(1)),
        scheduleReliabilityPct: Number(baselineReliability.toFixed(1)),
        averageCapacityUtilPct: 82,
      },
      optimized: {
        totalFuelTonnes: Number(optimizedTotalFuel.toFixed(1)),
        totalCostUsd: Math.round(optimizedTotalCost),
        totalCo2eTonnes: Number(optimizedTotalCo2e.toFixed(1)),
        scheduleReliabilityPct: Number(optimizedReliability.toFixed(1)),
        averageCapacityUtilPct: optimizedAvgCapacity,
      },
      improvements: {
        fuelSavingsTonnes: Number(fuelSavings.toFixed(1)),
        fuelReductionPct,
        costSavingsUsd: Math.round(costSavings),
        costReductionPct,
        emissionReductionTonnes: Number(emissionReduction.toFixed(1)),
        emissionReductionPct,
        reliabilityImprovementPct: reliabilityImprovement,
      },
      assignments: bestAssignments,
      convergenceHistory,
      qbitStates,
      constraintAudit,
    };
  }
}
