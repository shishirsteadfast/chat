// src/controllers/ChatMessageController.ts
import { Request, Response } from 'express';
import {
  Conversation,
  ProjectUser,
  ConversationParticipant,
  Message,
} from '../models';
// import { getIO } from '../sockets/ioInstance'; // if you wired socket.io global

export class ChatMessageController {
  /**
   * POST /api/conversations/:conversationId/messages
   * Body: { project_user_id, content, metadata? }
   */
  static async send(req: Request, res: Response) {
    const project = req.project;
    if (!project) return res.status(401).json({ message: 'Unauthorized' });

    const { conversationId } = req.params;
    const { project_user_id, content, metadata } = req.body;

    if (!project_user_id || !content) {
      return res
        .status(400)
        .json({ message: 'project_user_id and content are required' });
    }

    // 1) Conversation must belong to this project
    const conversation = await Conversation.findOne({
      where: { id: conversationId, project_id: project.id },
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // 2) Sender must be a member of this project
    const projectUser = await ProjectUser.findOne({
      where: { id: project_user_id, project_id: project.id },
    });
    if (!projectUser) {
      return res
        .status(400)
        .json({ message: 'Sender is not a member of this project' });
    }

    // 3) Sender must be a participant of this conversation (optional but correct)
    const participant = await ConversationParticipant.findOne({
      where: {
        conversation_id: conversation.id,
        project_user_id,
      },
    });
    if (!participant) {
      return res
        .status(403)
        .json({ message: 'Sender is not a participant of this conversation' });
    }

    // 4) Create message
    const message = await Message.create({
      conversation_id: conversation.id,
      project_user_id,
      content,
      metadata: metadata || null,
    });

    // 5) Update conversation updated_at
    conversation.updated_at = new Date();
    await conversation.save();

    // 6) Emit via WebSocket if you wired Socket.IO
    // const io = getIO();
    // io.to(`conversation:${conversation.id}`).emit('message:new', message);

    return res.status(201).json(message);
  }

  /**
   * GET /api/conversations/:conversationId/messages
   */
  static async list(req: Request, res: Response) {
    const project = req.project;
    if (!project) return res.status(401).json({ message: 'Unauthorized' });

    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      where: { id: conversationId, project_id: project.id },
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.findAll({
      where: { conversation_id: conversation.id },
      order: [['created_at', 'ASC']],
    });

    return res.json(messages);
  }
}
