import express from 'express';
import { createChatSession, getChatSessionByUserId, deleteChatSession } from '../controller/ChatSessionController';
import { verifyTokenMiddleware } from '../middlewares/verifyToken';

const router = express.Router();

router.post('/:sendUser_id', verifyTokenMiddleware, createChatSession);
router.get('/chat', verifyTokenMiddleware, getChatSessionByUserId);
router.delete('/:id', verifyTokenMiddleware, deleteChatSession);

export default router 