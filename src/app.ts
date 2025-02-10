import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
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
  origin: '*', // Permettre l'accès depuis n'importe quelle origine
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true
};

// Use CORS middleware
app.use(cors(corsOptions));

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRouter);

// Default route for 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
