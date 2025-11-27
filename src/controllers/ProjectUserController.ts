// src/controllers/ProjectUserController.ts
import { Request, Response } from 'express';
import { User, ProjectUser } from '../models';

export class ProjectUserController {
  /**
   * POST /api/users
   * Headers: x-api-key (project resolved by apiKeyAuth)
   * Body: { external_id, display_name }
   *
   * Returns: { user, projectUser }
   */
  static async upsertUser(req: Request, res: Response) {
    const project = req.project;
    if (!project) return res.status(401).json({ message: 'Unauthorized' });

    const { external_id, display_name } = req.body;

    if (!external_id) {
      return res.status(400).json({ message: 'external_id is required' });
    }

    // 1) Global user
    let user = await User.findOne({ where: { external_id } });
    if (!user) {
      user = await User.create({
        external_id,
        display_name: display_name || null,
      });
    } else if (display_name && user.display_name !== display_name) {
      user.display_name = display_name;
      await user.save();
    }

    // 2) Project membership
    let projectUser = await ProjectUser.findOne({
      where: {
        project_id: project.id,
        user_id: user.id,
      },
    });

    if (!projectUser) {
      projectUser = await ProjectUser.create({
        project_id: project.id,
        user_id: user.id,
        role: 'member',
      });
    }

    return res.json({
      user,
      projectUser,
    });
  }
}
