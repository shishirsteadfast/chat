// src/controllers/ChatConversationController.ts
import { Request, Response } from 'express';
import {
  Conversation,
  ProjectUser,
  ConversationParticipant,
} from '../models';

export class ChatConversationController {
  /**
   * POST /api/conversations
   * Body: { title, type, participant_project_user_ids: number[] }
   */
  static async create(req: Request, res: Response) {
    const project = req.project;
    if (!project) return res.status(401).json({ message: 'Unauthorized' });

    const { title, type, participant_project_user_ids } = req.body;

    if (!participant_project_user_ids || !Array.isArray(participant_project_user_ids)) {
      return res
        .status(400)
        .json({ message: 'participant_project_user_ids array is required' });
    }

    // Ensure all memberships belong to this project
    const participants = await ProjectUser.findAll({
      where: {
        id: participant_project_user_ids,
        project_id: project.id,
      },
    });

    if (participants.length !== participant_project_user_ids.length) {
      return res
        .status(400)
        .json({ message: 'One or more participants are not in this project' });
    }

    const conversation = await Conversation.create({
      project_id: project.id,
      title: title || null,
      type: type || 'direct',
    });

    await ConversationParticipant.bulkCreate(
      participant_project_user_ids.map((pid: number) => ({
        conversation_id: conversation.id,
        project_user_id: pid,
      }))
    );

    return res.status(201).json(conversation);
  }

  /**
   * GET /api/conversations
   * List conversations for current project
   */
  static async list(req: Request, res: Response) {
    const project = req.project;
    if (!project) return res.status(401).json({ message: 'Unauthorized' });

    const conversations = await Conversation.findAll({
      where: { project_id: project.id },
      order: [['updated_at', 'DESC']],
    });

    return res.json(conversations);
  }
}
