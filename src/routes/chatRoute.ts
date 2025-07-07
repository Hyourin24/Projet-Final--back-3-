import express from 'express';
import { createChat, modifyChat, deleteChat } from '../controller/ChatController';
import { verifyTokenMiddleware } from '../middlewares/verifyToken';

const router = express.Router();

router.post('/send/:user_chat', verifyTokenMiddleware, createChat);
router.put('/modify/:user_chat/:chatId', verifyTokenMiddleware, modifyChat);
router.delete('/delete/:user_chat/:chatId', verifyTokenMiddleware, deleteChat);

export default router 