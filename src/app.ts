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
const stripeWebhookRouter = require('./routes/stripeWebhook'); // Import Stripe webhook

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

// Configure CORS
const corsOptions = {
    origin: 'https://minima-app-frontend.vercel.app/', // Remplacez par l'URL de votre frontend déployé
    optionsSuccessStatus: 200 // Certains navigateurs (IE11, divers SmartTVs) utilisent 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/stock', stockRouter);
app.use('/api/sales', saleRouter);
app.use('/api/products', productRouter);
app.use('/api/declarations', declarationRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/stripe', stripeWebhookRouter); // Use Stripe routes

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
