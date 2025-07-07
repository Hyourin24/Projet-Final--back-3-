import express from "express";
import { createComment, getAllCommentByUser, modifyComment, deleteComment, getCommentById, getAllCommentByPost  } from "../controller/CommentController";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Créer un commentaire
 *     description: Ajoute un commentaire à un post donné
 *     tags:
 *       - Commentaires
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - comment
 *             properties:
 *               post_id:
 *                 type: integer
 *                 description: ID du post à commenter
 *               comment:
 *                 type: string
 *                 description: Contenu du commentaire
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *       400:
 *         description: Erreur de validation
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:post_id", verifyTokenMiddleware, createComment);

router.get("/:post_id", verifyTokenMiddleware, getAllCommentByPost);

/**
 * @swagger
 * /comment/{user_id}:
 *   get:
 *     summary: Récupérer tous les commentaires d'un utilisateur
 *     description: Retourne tous les commentaires postés par un utilisateur spécifique.
 *     tags:
 *       - Commentaires
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:user_id", verifyTokenMiddleware, getAllCommentByUser);

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Modifier un commentaire
 *     description: Permet de modifier le contenu d'un commentaire existant.
 *     tags:
 *       - Commentaires
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du commentaire à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Nouveau contenu du commentaire
 *     responses:
 *       200:
 *         description: Commentaire modifié avec succès
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", verifyTokenMiddleware, modifyComment);

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     description: Supprime un commentaire à partir de son ID.
 *     tags:
 *       - Commentaires
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du commentaire à supprimer
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", deleteComment);

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Récupérer un commentaire par ID
 *     description: Retourne un commentaire spécifique en fonction de son ID.
 *     tags:
 *       - Commentaires
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire trouvé
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", verifyTokenMiddleware, getCommentById);


export default router