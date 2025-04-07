import { Request, Response } from "express";
import Utilisateur from "../models/Utilisateur.model";
import { validateSchema } from "../utils/joiUtils";
import { sessionSchema } from "../JoiValidator/sessionValidator";
import Session from "../models/Session.model"

interface AuthRequest extends Request {
    user?: { id: number };
}

export async function createSession(req: AuthRequest, res: Response) {
    try {
        const { nom, description } = validateSchema(req, sessionSchema);
        let user_id = req.user?.id;

        const utilisateurExistant = await Utilisateur.findByPk(user_id);
        if (!nom || !description) {
            res.status(400).send('Le nom ou la description sont incomplets.');
            return
        }
        if (!utilisateurExistant) {
            res.status(403).json({ message: "Utilisateur non valide." });
            return
        }
        if (req.body.user_id && req.body.user_id !== user_id) {
            
            if (!utilisateurExistant || !utilisateurExistant.isAdmin) { 
                res.status(403).json({ message: "Vous ne pouvez pas créer une session pour un autre utilisateur." });
                return
            }
            user_id = req.body.user_id; 
        }

        if (!utilisateurExistant) {
            res.status(400).json({ message: "L'utilisateur avec cet ID n'existe pas." });
            return
        }
        if (!user_id) {
            throw new Error("user_id requis");
        }
        
        const sessionUser = await Session.create({ user_id, nom, description });
        res.status(201).json(sessionUser);
    } catch (err: any) {
        console.error("Erreur lors de la création de la session :", err);
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

export async function getAllSessionByUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const utilisateursSession = await Session.findAll({ where: { user_id } });
        if (!utilisateursSession) {
            res.status(404).json({ message: "Utilisateur non trouvé"})
        }
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function modifySession(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nom, description } = req.body;

        const sessionUser = await Session.findByPk(id);
        if (!sessionUser) {
            res.status(404).json({ message: "Session non trouvé" });
            return
        }


        if (nom) sessionUser.nom = nom;
        if (description) sessionUser.description = description

        await sessionUser.save();
        res.status(200).json({ message: "Session modifiée avec succès", sessionUser});
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function deleteSession(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const sessionUser = await Session.findByPk(id);
        if (!sessionUser) {
            res.status(404).json({ message: "Session non trouvée" });
            return
        }

        await sessionUser.destroy();
        res.json({ message: "Session supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function getSessionById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const utilisateursSession = await Session.findByPk(id);
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}