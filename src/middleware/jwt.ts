import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'dev-secret-change-in-production';

export interface JWTPayload {
  userId: string;
  userEmail: string;
  iat: number;
  exp: number;
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string, userEmail: string): string {
  return jwt.sign(
    { userId, userEmail },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT token and extract user info
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to authenticate requests using JWT token
 */
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header or cookie
    let token: string | undefined;
    
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Fallback to cookie if no Authorization header
    if (!token) {
      token = req.cookies?.token;
    }
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Verify user still exists
    const user = await storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Add user info to request
    (req as any).user = {
      id: payload.userId,
      email: payload.userEmail
    };
    
    next();
  } catch (error) {
    console.error('JWT authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    if (!token) {
      token = req.cookies?.token;
    }
    
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const user = await storage.getUser(payload.userId);
        if (user) {
          (req as any).user = {
            id: payload.userId,
            email: payload.userEmail
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
