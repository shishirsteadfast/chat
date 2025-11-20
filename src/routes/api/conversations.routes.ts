import { Router } from 'express';
import { ChatConversationController } from '../../controllers/ChatConversationController';

const router = Router();

router.post('/conversations', ChatConversationController.create);
router.get('/conversations', ChatConversationController.list);

export default router;
