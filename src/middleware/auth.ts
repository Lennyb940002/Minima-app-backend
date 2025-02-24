import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth';
import { User } from '../models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Token missing');
        }

        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = {
            userId: user.id,
            email: user.email,
            hasPaid: user.hasPaid,
            role: user.role
        };

        next();
    } catch (error) {
        res.status(401).json({
            error: error instanceof Error ? error.message : 'Authentication error'
        });
    }
};