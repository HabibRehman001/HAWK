import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { DEFAULT_PORT, ENV_KEYS } from './constants/index.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const PORT = Number(process.env[ENV_KEYS.PORT]) || DEFAULT_PORT;
const clientUrl = process.env[ENV_KEYS.CLIENT_URL] || 'http://localhost:5173';

app.use(
  cors({
    origin: clientUrl,
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    status: 'healthy',
    service: 'bluehawk-api',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/contact', contactRoutes);

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`BlueHawk API listening on http://localhost:${PORT}`);
});
