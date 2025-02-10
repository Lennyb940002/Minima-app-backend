import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import { authRouter } from './routes/auth';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

connectDB();

const corsOptions = {
  origin: ['https://minima-app-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// API routes
app.use('/api', authRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
