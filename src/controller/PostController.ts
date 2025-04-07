import { Request, Response } from "express";
import Utilisateur from "../models/Utilisateur.model";
import sequelize from "../config/database";
import { validateSchema } from "../utils/joiUtils";
import { hashPassword } from "../utils/pwdUtils";
import { postSchema } from "../JoiValidator/postValidator";
import Post from "../models/Post.model";
import Commentaire from "../models/Comment.model";


interface AuthRequest extends Request {
    user?: { id: number };
    comment?: { id: number}
}

export async function createPost(req: AuthRequest, res: Response) {
    try {
        // Validation des champs
        const { titre, post } = validateSchema(req, postSchema);
        let user_id = req.user?.id;
        
        const utilisateurExistant = await Utilisateur.findByPk(user_id);
        if(!titre || !post ){
            res.status(400).send('Le titre ou post sont incomplets.');
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
        
        const postUser = await Post.create({ user_id, titre, post });
        res.json(postUser);
    } catch (err: any) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Erreur interne', error: err.message });

    }
}

export async function getPostMe(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            res.status(401).json({ message: "Non autorisé. Utilisateur non authentifié." });
            return;
        }

        const userPost = await Post.findAll({
            where: { user_id },
            include: [
                {
                    model: Commentaire, 
                    as: "commentaires", 
                    required: false,
                },
            ],
            
        });

        if (!userPost) {
            res.status(404).json({ message: "Post introuvable." });
            return;
        }

        res.status(200).json(userPost);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur." });
        return;
    }
}

export async function getAllPostByUserWithComm(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const utilisateursSession = await Post.findAll({
            where: { user_id },
            include: [
                {
                    model: Commentaire, 
                    as: "commentaires", 
                    required: false,
                },
            ],
            // order: [["createdAt", "DESC"]], 
        });
        if (!utilisateursSession) {
            res.status(404).json({ message: "Utilisateur non trouvé"})
        }
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getAllPostByUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const utilisateursSession = await Post.findAll({
            where: { user_id }
        });
        if (!utilisateursSession) {
            res.status(404).json({ message: "Utilisateur non trouvé"})
        }
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function modifyPost(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { titre, post } = req.body;

        const postUser = await Post.findByPk(id);
        if (!postUser) {
            res.status(404).json({ message: "Post non trouvé" });
            return
        }


        if (titre) postUser.titre = titre;
        if (post) postUser.post = post;

        await postUser.save();
        res.status(200).json({ message: "Post modifié avec succès", postUser});
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function deletePost(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const postUser = await Post.findByPk(id);
        if (!postUser) {
            res.status(404).json({ message: "Post non trouvé" });
            return
        }

        await postUser.destroy();
        res.json({ message: "Post supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function getPostById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const utilisateursPost = await Post.findByPk(id);
        res.send(utilisateursPost);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
