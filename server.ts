import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'FleetSafe Quantum-Inspired Fleet Optimization Engine',
    version: '2.4.0-hackathon-release',
    timestamp: new Date().toISOString(),
  });
});

// System info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'FleetSafe',
    description: 'Quantum-Inspired Fuel Consumption Prediction & Green Fleet Optimization Platform',
    models: ['RandomForest-Maritime-v2', 'QuantumKernel-Regressor-Q16', 'QGA-FleetOptimizer-v4'],
    fuelTypes: ['Marine Diesel', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'],
    demoMode: true,
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FleetSafe] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
