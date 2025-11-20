import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
  }
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  next();
}
