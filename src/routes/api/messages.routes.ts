// src/routes/api/messages.routes.ts
import { Router } from 'express';
import { ChatMessageController } from '../../controllers/ChatMessageController';

const router = Router();

router.post(
  '/conversations/:conversationId/messages',
  ChatMessageController.send
);
router.get(
  '/conversations/:conversationId/messages',
  ChatMessageController.list
);

export default router;
