// authService.ts
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
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const user = new User({ email, password });
    await user.save();
    return this.formatUserResponse(user);
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return this.formatUserResponse(user);
  }
}
