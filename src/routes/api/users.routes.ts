import { Router } from 'express';
import { ProjectUserController } from '../../controllers/ProjectUserController';

const router = Router();

// POST /api/users
router.post('/users', ProjectUserController.upsertUser);

export default router;
