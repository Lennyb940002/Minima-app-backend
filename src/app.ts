import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS options
const corsOptions = {
  origin: 'https://minima-app-frontend.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

// Use CORS middleware
app.use(cors(corsOptions));

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.post('/api/auth/login', (req, res) => {
  // Your login logic here
  res.send('Login endpoint');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
