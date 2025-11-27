// src/controllers/AdminAuthController.ts
import { Request, Response } from 'express';
import { Admin, PasswordResetToken } from '../models';
import { comparePassword, hashPassword } from '../utils/password';
import { generateResetToken } from '../utils/tokens';
import { sendPasswordResetEmail } from '../utils/mailer';
import { Op } from 'sequelize';

export class AdminAuthController {
  static loginPage(req: Request, res: Response) {
    if (req.session.adminId) return res.redirect('/admin/projects');
    res.render('auth/login', {
      layout: 'layouts/auth',
      title: 'Admin Login',
      pageTitle: 'Admin Login',
      error: null,
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.render('auth/login', {
        layout: 'layouts/auth',
        title: 'Admin Login',
        pageTitle: 'Admin Login',
        error: 'Invalid credentials',
      });
    }

    const ok = await comparePassword(password, admin.password_hash);
    if (!ok) {
      return res.render('auth/login', {
        layout: 'layouts/auth',
        title: 'Admin Login',
        pageTitle: 'Admin Login',
        error: 'Invalid credentials',
      });
    }

    req.session.adminId = admin.id;
    res.redirect('/admin/projects');
  }

  static logout(req: Request, res: Response) {
    req.session.destroy(() => res.redirect('/admin/login'));
  }

  static forgotPasswordPage(req: Request, res: Response) {
    res.render('auth/forgot-password', {
      layout: 'layouts/auth',
      title: 'Forgot Password',
      pageTitle: 'Forgot Password',
      error: null,
      message: null,
    });
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.render('auth/forgot-password', {
        layout: 'layouts/auth',
        title: 'Forgot Password',
        pageTitle: 'Forgot Password',
        error: 'If this email exists, a link was sent.',
        message: null,
      });
    }

    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetToken.create({
      admin_id: admin.id,
      token,
      expires_at: expiresAt,
    });

    await sendPasswordResetEmail(admin.email, token);

    return res.render('auth/forgot-password', {
      layout: 'layouts/auth',
      title: 'Forgot Password',
      pageTitle: 'Forgot Password',
      error: null,
      message: 'Password reset link sent to your email.',
    });
  }

  static async resetPasswordPage(req: Request, res: Response) {
    const { token } = req.params;

    const record = await PasswordResetToken.findOne({
      where: {
        token,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!record) {
      return res.send('Invalid or expired token');
    }

    res.render('auth/reset-password', {
      layout: 'layouts/auth',
      title: 'Reset Password',
      pageTitle: 'Reset Password',
      token,
      error: null,
    });
  }

  static async resetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;

    const record = await PasswordResetToken.findOne({
      where: {
        token,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!record) return res.send('Invalid or expired token');

    const admin = await Admin.findByPk(record.admin_id);
    if (!admin) return res.send('Admin not found');

    admin.password_hash = await hashPassword(password);
    await admin.save();

    record.used = true;
    await record.save();

    res.redirect('/admin/login');
  }
}
