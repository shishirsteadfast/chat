import { Router } from 'express';
import adminAuthRoutes from './admin/auth.routes';
import adminProjectRoutes from './admin/project.routes';
import apiUserRoutes from './api/users.routes';
import apiConversationRoutes from './api/conversations.routes';
import apiMessageRoutes from './api/messages.routes';
import { apiKeyAuth } from '../middlewares/apiKeyAuth';

const router = Router();

// Admin panel
router.use('/admin', adminAuthRoutes);
router.use('/admin', adminProjectRoutes);

// Chat API (project-wise)
router.use('/api', apiKeyAuth, apiUserRoutes);
router.use('/api', apiKeyAuth, apiConversationRoutes);
router.use('/api', apiKeyAuth, apiMessageRoutes);

export default router;
