import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        hasPaid: boolean;
        role: 'admin' | 'user';
    };
}