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
        
        if(!titre || !post ){
            res.status(400).send('Le titre ou post sont incomplets.');
            return 
        }
        
        if (!user_id) {
            res.status(400).send('Utilisateur non authentifié.');
            return;
        }
        const postUser = await Post.create({ user_id, titre, post });
        res.json(postUser);
    } catch (err: any) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Erreur interne', error: err.message });

    }
}
export async function getAllPost(req: Request, res: Response) {
    try {
        const allPosts = await Post.findAll()
        res.send(allPosts);
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

export async function deletePost(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.id;
        const { id } = req.params;

        const postUser = await Post.findByPk(id);
        if (!postUser) {
            res.status(404).json({ message: "Post non trouvé" });
            return
        }

        if ((postUser.user_id) !== (user_id)) {
            res.status(403).json({ message: "Vous ne pouvez supprimer que vos propres posts." });
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

export async function getAllPostByUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const utilisateursSession = await Post.findAll({where: { user_id }});
        if (!utilisateursSession) {
            res.status(404).json({ message: "Utilisateur non trouvé"})
        }
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deletePostAdmin(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const postUser = await Post.findByPk(id);
    if (!postUser) {
      res.status(404).json({ message: "Post non trouvé" });
      return
    }

    await postUser.destroy();
    res.json({ message: "Commentaire supprimé avec succès par l'admin." });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
