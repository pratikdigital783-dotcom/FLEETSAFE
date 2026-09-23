import { ModelTrainingState } from '../types';

export class ModelTrainingService {
  /**
   * Generates synthetic dataset of maritime voyage observations
   */
  public static getInitialTrainingState(): ModelTrainingState {
    // Generate realistic Actual vs Predicted scatter points
    const actualVsPredicted = [
      { actual: 68.4, predicted: 67.8, vessel: 'Container 14k' },
      { actual: 114.2, predicted: 116.1, vessel: 'Container 18k' },
      { actual: 36.8, predicted: 37.2, vessel: 'Bulk 120k' },
      { actual: 88.5, predicted: 89.1, vessel: 'Methanol 16k' },
      { actual: 46.2, predicted: 45.4, vessel: 'Bulk 180k' },
      { actual: 31.0, predicted: 30.7, vessel: 'Tanker 115k' },
      { actual: 43.5, predicted: 44.1, vessel: 'Ro-Ro 7.2k' },
      { actual: 10.8, predicted: 11.2, vessel: 'Hydrogen 35k' },
      { actual: 78.2, predicted: 76.9, vessel: 'Container 15k' },
      { actual: 95.4, predicted: 97.2, vessel: 'Container 16k' },
      { actual: 52.1, predicted: 50.8, vessel: 'Bulk 150k' },
      { actual: 28.6, predicted: 29.4, vessel: 'Small Tanker' },
      { actual: 122.4, predicted: 120.9, vessel: 'Ultra Large Container' },
      { actual: 64.0, predicted: 65.2, vessel: 'Liner Mid-Route' },
      { actual: 19.5, predicted: 19.1, vessel: 'Feeder Ro-Ro' },
    ];

    const residualDistribution = [
      { bin: '-4.0 to -2.5', count: 18 },
      { bin: '-2.5 to -1.0', count: 64 },
      { bin: '-1.0 to +0.0', count: 182 },
      { bin: '+0.0 to +1.0', count: 196 },
      { bin: '+1.0 to +2.5', count: 58 },
      { bin: '+2.5 to +4.0', count: 14 },
    ];

    const featureImportance = [
      { feature: 'Cruising Speed (V³)', importancePct: 38.4 },
      { feature: 'Displacement / Payload Weight', importancePct: 22.8 },
      { feature: 'Wave Height & Sea State Drag', importancePct: 14.6 },
      { feature: 'Engine Thermal Efficiency (SFOC)', importancePct: 11.2 },
      { feature: 'Relative Wind Velocity', importancePct: 7.5 },
      { feature: 'Hull Age & Fouling Factor', importancePct: 5.5 },
    ];

    return {
      datasetSize: 1280,
      trainingSamples: 1024,
      testingSamples: 256,
      selectedModel: 'Random Forest (Ensemble)',
      isTraining: false,
      trainingProgressPct: 100,
      currentEpoch: 50,
      totalEpochs: 50,
      metrics: {
        mae: 1.42, // Tonnes/day
        rmse: 1.88,
        mape: 2.34, // %
        r2Score: 0.968,
      },
      featureImportance,
      actualVsPredicted,
      residualDistribution,
      trainingLogs: [
        '[1/50] Feature extraction completed: 1,280 samples with 12 maritime kinematic covariates.',
        '[15/50] Bootstrap aggregation: 150 estimator trees constructed with Admiralty regularizer.',
        '[35/50] Cross-validation fold 5/5: Out-of-bag MSE = 3.52, R² = 0.954.',
        '[50/50] Training converged. Model serialized: RandomForest-Maritime-v2. MAE = 1.42 t/day, R² = 0.968.',
      ],
    };
  }

  /**
   * Simulates real-time model retraining with realistic statistical shifts
   */
  public static simulateRetrain(
    modelType: 'Random Forest (Ensemble)' | 'Gradient Boosting Regressor' | 'Quantum-Kernel Ridge' | 'Deep Multi-Layer Perceptron',
    onProgress: (state: Partial<ModelTrainingState>) => void
  ): Promise<ModelTrainingState> {
    return new Promise((resolve) => {
      let epoch = 0;
      const totalEpochs = 40;
      const logs: string[] = [];

      const interval = setInterval(() => {
        epoch += 4;
        const progress = Math.min(100, Math.round((epoch / totalEpochs) * 100));

        let currentMae = 4.2 - (epoch / totalEpochs) * 2.8;
        let currentR2 = 0.78 + (epoch / totalEpochs) * 0.19;

        if (modelType === 'Quantum-Kernel Ridge') {
          currentMae = 3.8 - (epoch / totalEpochs) * 2.5;
          currentR2 = 0.81 + (epoch / totalEpochs) * 0.165;
        }

        const logLine = `[Epoch ${epoch}/${totalEpochs}] Loss: ${(currentMae * 1.3).toFixed(3)} | Validation R²: ${currentR2.toFixed(3)} | Kernel variance: ${(0.45 - epoch * 0.005).toFixed(3)}`;
        logs.push(logLine);

        onProgress({
          isTraining: true,
          trainingProgressPct: progress,
          currentEpoch: epoch,
          totalEpochs,
          trainingLogs: [...logs].slice(-6),
          metrics: {
            mae: Number(currentMae.toFixed(2)),
            rmse: Number((currentMae * 1.32).toFixed(2)),
            mape: Number((currentMae * 1.6).toFixed(2)),
            r2Score: Number(currentR2.toFixed(3)),
          },
        });

        if (epoch >= totalEpochs) {
          clearInterval(interval);

          const finalMetrics =
            modelType === 'Quantum-Kernel Ridge'
              ? { mae: 1.36, rmse: 1.74, mape: 2.15, r2Score: 0.974 }
              : modelType === 'Gradient Boosting Regressor'
              ? { mae: 1.39, rmse: 1.82, mape: 2.28, r2Score: 0.971 }
              : modelType === 'Deep Multi-Layer Perceptron'
              ? { mae: 1.54, rmse: 2.05, mape: 2.65, r2Score: 0.958 }
              : { mae: 1.42, rmse: 1.88, mape: 2.34, r2Score: 0.968 };

          const finalState: ModelTrainingState = {
            datasetSize: 1280,
            trainingSamples: 1024,
            testingSamples: 256,
            selectedModel: modelType,
            isTraining: false,
            trainingProgressPct: 100,
            currentEpoch: totalEpochs,
            totalEpochs,
            metrics: finalMetrics,
            featureImportance: [
              { feature: 'Cruising Speed (V³)', importancePct: 37.8 },
              { feature: 'Displacement / Payload Weight', importancePct: 23.4 },
              { feature: 'Wave Height & Sea State Drag', importancePct: 15.2 },
              { feature: 'Engine Thermal Efficiency (SFOC)', importancePct: 10.8 },
              { feature: 'Relative Wind Velocity', importancePct: 7.2 },
              { feature: 'Hull Age & Fouling Factor', importancePct: 5.6 },
            ],
            actualVsPredicted: [
              { actual: 68.4, predicted: 68.1, vessel: 'Container 14k' },
              { actual: 114.2, predicted: 115.3, vessel: 'Container 18k' },
              { actual: 36.8, predicted: 36.9, vessel: 'Bulk 120k' },
              { actual: 88.5, predicted: 88.9, vessel: 'Methanol 16k' },
              { actual: 46.2, predicted: 45.8, vessel: 'Bulk 180k' },
              { actual: 31.0, predicted: 30.9, vessel: 'Tanker 115k' },
              { actual: 43.5, predicted: 43.8, vessel: 'Ro-Ro 7.2k' },
              { actual: 10.8, predicted: 10.9, vessel: 'Hydrogen 35k' },
            ],
            residualDistribution: [
              { bin: '-3.0 to -1.5', count: 24 },
              { bin: '-1.5 to -0.5', count: 78 },
              { bin: '-0.5 to +0.5', count: 240 },
              { bin: '+0.5 to +1.5', count: 180 },
              { bin: '+1.5 to +3.0', count: 32 },
            ],
            trainingLogs: [
              ...logs,
              `✓ Converged with optimal weights. Saved as ${modelType} (Validated on IMO standard dataset).`,
            ],
          };

          resolve(finalState);
        }
      }, 120);
    });
  }
}
