import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authRouter = Router();

const logAuthAttempt = (req: Request, res: Response, next: Function) => {
    console.log('Auth attempt:', {
        path: req.path,
        method: req.method,
        body: req.body,
        headers: req.headers
    });
    next();
};

authRouter.post('/login', logAuthAttempt, async (req: Request, res: Response) => {
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
        return res.status(401).json({
            error: error instanceof Error ? error.message : 'Authentication failed'
        });
    }
});

authRouter.post('/register', logAuthAttempt, async (req: Request, res: Response) => {
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
        return res.status(400).json({
            error: error instanceof Error ? error.message : 'Registration failed'
        });
    }
});

export { authRouter };
