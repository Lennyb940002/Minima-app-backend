// authRouter.ts
import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authRouter = Router();

// Debugging middleware
authRouter.use((req, res, next) => {
  console.log(`Auth request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const result = await AuthService.login(email, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({
      error: error instanceof Error ? error.message : 'Authentication failed'
    });
  }
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const result = await AuthService.register(email, password);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

export { authRouter };
