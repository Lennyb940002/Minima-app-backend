import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './utils/db';
import { authRouter } from './routes/auth';

dotenv.config();

const app = express();

// Connexion à MongoDB
connectDB();

// Configuration de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());

// Protection contre les requêtes abusives
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Routes
app.use('/api', authRouter);

// Route de test
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Minima App Backend!</h1>');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

export default app;
