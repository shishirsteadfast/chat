// src/routes/admin/project.routes.ts
import { Router } from 'express';
import { AdminProjectController } from '../../controllers/AdminProjectController';
import { requireAdminAuth } from '../../middlewares/adminAuth';

const router = Router();

router.get('/projects', requireAdminAuth, AdminProjectController.list);
router.get('/projects/create', requireAdminAuth, AdminProjectController.createPage);
router.post('/projects/create', requireAdminAuth, AdminProjectController.create);
router.get('/projects/:id/edit', requireAdminAuth, AdminProjectController.editPage);
router.post('/projects/:id/edit', requireAdminAuth, AdminProjectController.update);
router.post('/projects/:id/delete', requireAdminAuth, AdminProjectController.delete);

export default router;
