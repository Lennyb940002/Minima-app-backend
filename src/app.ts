import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes';
import { stockRouter } from './routes/stockRoutes';
import { saleRouter } from './routes/saleRoutes';
import { productRouter } from './routes/productRoutes';
import { declarationRouter } from './routes/declarationRoutes';
import { marketingRouter } from './routes/marketingRoutes';
const stripeWebhookRouter = require('./routes/stripeWebhook');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Configuration CORS simplifiée
app.use(cors({
    origin: 'https://minima-app-frontend.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour gérer les requêtes OPTIONS
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://minima-app-frontend.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
});

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/stock', stockRouter);
app.use('/api/sales', saleRouter);
app.use('/api/products', productRouter);
app.use('/api/declarations', declarationRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/stripe', stripeWebhookRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something broke!',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
