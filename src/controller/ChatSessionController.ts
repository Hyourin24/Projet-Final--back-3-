import { Request, Response } from "express";
import ChatSession from "../models/ChatSession.model";
import Utilisateur from "../models/Utilisateur.model";
import { validateSchema } from "../utils/joiUtils";
import { Op } from "sequelize";


interface AuthRequest extends Request {
    user?: { id: number };
}

export async function createChatSession (req: AuthRequest, res: Response) {
    try {
        const sendUser_id  = parseInt(req.params.sendUser_id, 10);
        const user_id = req.user?.id;
        if (!user_id ) {
            res.status(400).json({ message: "Données manquantes." });
            return;
        }
        if (!sendUser_id) {
            res.status(400).json({ message: "L'ID de l'utilisateur destinataire est requis." });
            return;
        }

        if (sendUser_id === user_id) {
            res.status(400).json({ message: "Vous ne pouvez pas créer une session de chat avec vous-même." });
            return;
        }
        const sendUserExistant = await Utilisateur.findByPk(sendUser_id);
        const userExistant = await Utilisateur.findByPk(user_id);
        if (!sendUserExistant || !userExistant) {
            res.status(404).json({ message: "Destinataire introuvable.", sendUser_id, user_id});
            return
        }
      
        const chat = await ChatSession.create({ user_id, sendUser_id });
        res.status(201).json(chat);
        return;
    }
    catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}

export async function getChatSessionByUserId(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            res.status(400).json({ message: "Données manquantes." });
            return;
        }
        
        const chats = await ChatSession.findAll({ where: {
            [Op.or]: [
                { user_id: user_id },
                { sendUser_id: user_id }
            ]
        } });

        res.status(200).json(chats);
        return;
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}


export async function deleteChatSession(req: AuthRequest, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const user_id = req.user?.id;
        if (!id) {
            res.status(400).json({ message: "Données manquantes." });
            return;
        }
        
        const chat = await ChatSession.findByPk(id);
        if (!chat) {
            res.status(404).json({ message: "Chat introuvable." });
            return;
        }

        if (chat.user_id !== user_id ) {
            res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette session de chat." });
            return;
        }
        
        await chat.destroy();
        res.status(200).json({ message: "Chat supprimé avec succès." });
        return;
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}

