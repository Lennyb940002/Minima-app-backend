import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';  // Ajout du middleware Helmet pour la sécurité
import rateLimit from 'express-rate-limit'; // Ajout du rate limiting
import { connectDB } from './utils/db';
import { authRouter } from './routes/auth';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Configure CORS options
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet()); // Utilisation de Helmet pour améliorer la sécurité
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Routes
app.use('/api', authRouter);

// Default route for 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
