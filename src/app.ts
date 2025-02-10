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

// Configuration CORS améliorée
const corsOptions = {
    origin: 'https://minima-app-frontend.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// Middleware CORS global
app.use(cors(corsOptions));

// Middleware pour gérer les en-têtes CORS de manière plus précise
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://minima-app-frontend.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/stock', stockRouter);
app.use('/api/sales', saleRouter);
app.use('/api/products', productRouter);
app.use('/api/declarations', declarationRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/stripe', stripeWebhookRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
