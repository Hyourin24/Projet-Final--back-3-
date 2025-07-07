import { Request, Response } from "express";
import Chats from "../models/Chats.model";
import Utilisateur from "../models/Utilisateur.model";
import { validateSchema } from "../utils/joiUtils";
import { Op } from "sequelize";
import ChatSession from "../models/ChatSession.model";


interface AuthRequest extends Request {
    user?: { id: number };
}

export async function createChat (req: AuthRequest, res: Response) {
    try {
        const { message} = req.body;
        const user_id = req.user?.id;
        if (!user_id) {
            res.status(400).json({ message: "Données manquantes." });
            return;
        }
        const user_chat = parseInt(req.params.user_chat, 10);
        if (!user_chat ) {
            res.status(400).json({ message: "Données manquantes." });
            return;
        }
        if (!message) {
            res.status(400).json({ message: "Le message est requis." });
            return;
        }
        const chatSessionExistante = await ChatSession.findByPk(user_chat);
        if (!chatSessionExistante) {
            res.status(404).json({ message: "Session de chat introuvable.", user_chat });
            return;
        }


      
        const chat = await Chats.create({ user_chat, user_id, message });
        res.status(201).json(chat);
        return;
    }
    catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}

export async function modifyChat(req: AuthRequest, res: Response) {
    try {
        const { message } = req.body;
        const user_id = req.user?.id;
        const chatId = parseInt(req.params.chatId, 10);
        if (!chatId || !message) {
            res.status(400).json({ message: "Données manquantes." });
            return;
        }

        const chat = await Chats.findByPk(chatId);
        if (!chat) {
            res.status(404).json({ message: "Chat introuvable." });
            return;
        }

        if (chat.user_id !== user_id) {
            res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce message." });
            return
        }

        chat.message = message;
        await chat.save();
        res.status(200).json(chat);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }

}

export async function deleteChat(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.id;
        const chatId = parseInt(req.params.chatId, 10);
        if (!chatId) {
            res.status(400).json({ message: "Données manquantes." });
            return;
        }

        const chat = await Chats.findByPk(chatId);
        if (!chat) {
            res.status(404).json({ message: "Chat introuvable." });
            return;
        }

        if (chat.user_id !== user_id) {
            res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce message." });
            return
        }

        await chat.destroy();
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}
