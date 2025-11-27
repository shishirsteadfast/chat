// src/routes/admin/auth.routes.ts
import { Router } from 'express';
import { AdminAuthController } from '../../controllers/AdminAuthController';

const router = Router();

router.get('/login', AdminAuthController.loginPage);
router.post('/login', AdminAuthController.login);
router.get('/logout', AdminAuthController.logout);

router.get('/forgot-password', AdminAuthController.forgotPasswordPage);
router.post('/forgot-password', AdminAuthController.forgotPassword);

router.get('/reset-password/:token', AdminAuthController.resetPasswordPage);
router.post('/reset-password/:token', AdminAuthController.resetPassword);

export default router;
