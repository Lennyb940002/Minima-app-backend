import { Router, RequestHandler } from 'express';
import { AuthService } from '../services/authService';

const authRouter = Router();

interface AuthRequestBody {
    email: string;
    password: string;
}

const register: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, password } = req.body as AuthRequestBody;

        if (!email || !password) {
            res.status(400).json({
                error: 'Email and password are required'
            });
            return;
        }

        const result = await AuthService.register(email, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Registration error'
        });
    }
};

const login: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, password } = req.body as AuthRequestBody;

        if (!email || !password) {
            res.status(400).json({
                error: 'Email and password are required'
            });
            return;
        }

        const result = await AuthService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({
            error: error instanceof Error ? error.message : 'Login error'
        });
    }
};

authRouter.post('/register', register);
authRouter.post('/login', login);

export { authRouter };