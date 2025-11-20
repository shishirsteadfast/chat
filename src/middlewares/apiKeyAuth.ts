import { Request, Response, NextFunction } from 'express';
import { Project } from '../models';

declare global {
  namespace Express {
    interface Request {
      project?: Project;
    }
  }
}

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('x-api-key');
  if (!apiKey) {
    return res.status(401).json({ message: 'Missing API key' });
  }

  const project = await Project.findOne({ where: { api_key: apiKey } });
  if (!project) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  req.project = project;
  next();
}
