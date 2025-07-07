import { Request, Response } from "express";
import Utilisateur from "../models/Utilisateur.model";
import { validateSchema } from "../utils/joiUtils";
import { commentSchema } from "../JoiValidator/commentValidators";
import Commentaire from "../models/Comment.model";
import Post from "../models/Post.model";


interface AuthRequest extends Request {
    user?: { id: number };
}

export async function createComment(req: AuthRequest, res: Response) {
    try {
        // Validation des champs
        const { comment } = validateSchema(req, commentSchema);
        let user_id = req.user?.id;
        const post_id = Number(req.params.post_id);

        const utilisateurExistant = await Utilisateur.findByPk(user_id);
        const postExistant = await Post.findByPk(post_id);
        if(!comment ){
            res.status(400).send('Le commentaire est incomplet.');
            return 
        }
        if (!utilisateurExistant) {
            res.status(403).json({ message: "Utilisateur non valide." });
            return
        }
        if (req.body.post_id && req.body.post_id !== post_id) {
           if (!postExistant || !utilisateurExistant.isAdmin) {
                res.status(403).json({ message: "Vous ne pouvez pas créer un commentaire pour un autre post." });
                return
            }
        }

        if (!utilisateurExistant) {
            res.status(400).json({ message: "L'utilisateur avec cet ID n'existe pas." });
            return
        }
        if (!postExistant) {
            res.status(400).json({ message: "Le post avec cet ID n'existe pas." });
            return
        }

        if(!comment ){
            res.status(400).send('Le commentaire est incomplet.');
            return 
        }
        if (!user_id) {
            throw new Error("user_id est requis");
        }
        const commentUser = await Commentaire.create({ post_id, comment, user_id });
        res.json(commentUser);
    } catch (err: any) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        

    }
}

export async function getAllCommentByPost(req: Request, res: Response) {
    try {
        const { post_id } = req.params;
        const utilisateursSession = await Commentaire.findAll({where: { post_id }});
        if (!utilisateursSession) {
            res.status(404).json({ message: "Post non trouvé"})
        }
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getAllCommentByUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const utilisateursSession = await Commentaire.findAll({where: { user_id }});
        if (!utilisateursSession) {
            res.status(404).json({ message: "Utilisateur non trouvé"})
        }
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function modifyComment(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const commentUser = await Commentaire.findByPk(id);
        if (!commentUser) {
            res.status(404).json({ message: "Commentaire non trouvé" });
            return
        }


        if (comment) commentUser.comment = comment;

        await commentUser.save();
        res.status(200).json({ message: "Commentaire modifié avec succès", commentUser});
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function deleteComment(req: Request, res: Response) {
    try {
        const {id } = req.params;

        const commentUser = await Commentaire.findByPk(id);
        if (!commentUser) {
            res.status(404).json({ message: "Commentaire non trouvé" });
            return
        }

        await commentUser.destroy();
        res.json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function getCommentById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const utilisateursComment = await Utilisateur.findByPk(id);
        res.send(utilisateursComment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
