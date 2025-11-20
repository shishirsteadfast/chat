// src/controllers/ChatUserController.ts
import { Request, Response } from 'express';
import { ChatUser } from '../models';

export class ChatUserController {
  static async upsertUser(req: Request, res: Response) {
    const project = req.project;
    if (!project) return res.status(401).end();

    const { external_id, display_name } = req.body;
    if (!external_id) {
      return res.status(400).json({ message: 'external_id is required' });
    }

    const [user] = await ChatUser.findOrCreate({
      where: {
        project_id: project.id,
        external_id,
      },
      defaults: {
        project_id: project.id,
        external_id,
        display_name: display_name || null,
      },
    });

    // Update display_name if changed
    if (display_name && user.display_name !== display_name) {
      user.display_name = display_name;
      await user.save();
    }

    return res.json(user);
  }
}
