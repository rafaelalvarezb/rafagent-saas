import type { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { authenticateJWT } from './jwt';

/**
 * Middleware to check if user is authenticated using JWT
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  return authenticateJWT(req, res, next);
}

/**
 * Get current user from JWT token
 */
export async function getCurrentUser(req: Request) {
  const user = (req as any).user;
  if (!user) {
    return null;
  }
  
  return await storage.getUser(user.id);
}

/**
 * Get current user ID from JWT token
 */
export function getCurrentUserId(req: Request): string | null {
  const user = (req as any).user;
  return user?.id || null;
}

