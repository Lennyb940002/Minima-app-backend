import { User, IUser } from '../models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: string;
        hasPaid: boolean;
    };
    token: string;
}

export class AuthService {
    private static readonly TOKEN_EXPIRATION = '24h';

    private static createToken(user: IUser): string {
        console.log('Creating token for user:', user.email);
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                hasPaid: user.hasPaid
            },
            config.jwtSecret,
            { expiresIn: this.TOKEN_EXPIRATION }
        );
    }

    private static formatUserResponse(user: IUser): AuthResponse {
        console.log('Formatting user response for user:', user.email);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                hasPaid: user.hasPaid
            },
            token: this.createToken(user)
        };
    }

    static async register(email: string, password: string): Promise<AuthResponse> {
        console.log('Registering user with email:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already in use:', email);
            throw new Error('Email already in use');
        }

        const user = new User({ email, password });
        await user.save();
        console.log('User registered successfully:', email);

        return this.formatUserResponse(user);
    }

    static async login(email: string, password: string): Promise<AuthResponse> {
        console.log('Logging in user with email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid credentials for email:', email);
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid credentials for email:', email);
            throw new Error('Invalid credentials');
        }

        console.log('User logged in successfully:', email);
        return this.formatUserResponse(user);
    }

    static verifyToken(token: string): JwtPayload {
        console.log('Verifying token');
        try {
            return jwt.verify(token, config.jwtSecret) as JwtPayload;
        } catch (error) {
            console.log('Invalid token');
            throw new Error('Invalid token');
        }
    }

    static async updatePaymentStatus(userId: string): Promise<void> {
        console.log('Updating payment status for user ID:', userId);
        const user = await User.findById(userId);
        if (user) {
            user.hasPaid = true;
            await user.save();
            console.log('Payment status updated for user ID:', userId);
        } else {
            console.log('User not found for user ID:', userId);
        }
    }

    static async getUserById(userId: string): Promise<IUser> {
        console.log('Getting user by ID:', userId);
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for user ID:', userId);
            throw new Error('User not found');
        }
        console.log('User found for user ID:', userId);
        return user;
    }
}
