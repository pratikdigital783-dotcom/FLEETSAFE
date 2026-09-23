import { FuelType, ScenarioResultRow, VesselType } from '../types';
import { FUEL_SPECIFICATIONS } from '../data/constants';
import { FuelPredictionService } from './predictionService';

export interface ScenarioParams {
  vesselType: VesselType;
  capacity: number;
  enginePowerKw: number;
  speedKnots: number;
  distanceNm: number;
  cargoLoadPct: number;
  fuelPriceMultipliers: Record<FuelType, number>;
  carbonTaxUsdPerTonne: number;
  shorePowerAvailable: boolean;
}

export class ScenarioService {
  public static runScenario(params: ScenarioParams): ScenarioResultRow[] {
    const {
      vesselType,
      capacity,
      enginePowerKw,
      speedKnots,
      distanceNm,
      cargoLoadPct,
      fuelPriceMultipliers,
      carbonTaxUsdPerTonne,
      shorePowerAvailable,
    } = params;

    const fuels: FuelType[] = ['Marine Diesel', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'];

    return fuels.map((fuelType) => {
      const spec = FUEL_SPECIFICATIONS[fuelType];
      const priceMultiplier = fuelPriceMultipliers[fuelType] ?? 1.0;
      const effectivePrice = spec.pricePerTonneUsd * priceMultiplier;

      // Predict consumption with physics model
      const prediction = FuelPredictionService.predict({
        vesselType,
        capacity,
        vesselAge: 3,
        enginePowerKw,
        vesselSpeedKnots: speedKnots,
        distanceNm,
        cargoLoadPct,
        weatherCondition: 'Moderate',
        windSpeedKnots: 15,
        waveHeightM: 2.0,
        seaCondition: 'Moderate',
        fuelType,
        engineEfficiency: 0.48,
        shorePowerAvailable,
      });

      const consumption = prediction.fuelConsumptionTonnes;
      const fuelCost = consumption * effectivePrice;
      const operationalCo2 = prediction.co2eOperationalTonnes;
      const lifecycleCo2 = prediction.co2eLifecycleTonnes;
      const carbonTaxCost = operationalCo2 * carbonTaxUsdPerTonne;
      const totalCost = fuelCost + carbonTaxCost;

      // Feasibility assessment
      let operationalFeasibility: 'High' | 'Moderate' | 'Limited Infrastructure' | 'Experimental' = 'High';
      if (fuelType === 'Marine Diesel') operationalFeasibility = 'High';
      else if (fuelType === 'LNG') operationalFeasibility = 'High';
      else if (fuelType === 'Methanol') operationalFeasibility = 'Moderate';
      else if (fuelType === 'Ammonia') operationalFeasibility = 'Limited Infrastructure';
      else if (fuelType === 'Hydrogen') operationalFeasibility = 'Experimental';

      // Composite score out of 100
      // Balance cost index, emission reduction index, and availability index
      const emissionScore = Math.max(0, 100 - (lifecycleCo2 / Math.max(1, distanceNm * 0.05)) * 100);
      const costScore = Math.max(0, 100 - (totalCost / Math.max(1, distanceNm * 60)) * 100);
      const score = Math.round(0.45 * emissionScore + 0.35 * costScore + 0.20 * spec.availabilityIndex);

      return {
        fuelType,
        fuelConsumptionTonnes: consumption,
        fuelCostUsd: Math.round(fuelCost),
        carbonTaxCostUsd: Math.round(carbonTaxCost),
        totalCostUsd: Math.round(totalCost),
        operationalCo2eTonnes: operationalCo2,
        lifecycleCo2eTonnes: lifecycleCo2,
        availabilityIndex: spec.availabilityIndex,
        operationalFeasibility,
        overallScore: Math.min(99, Math.max(20, score)),
      };
    });
  }
}
