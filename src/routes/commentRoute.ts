import express from "express";
import { createComment, getAllCommentByUser, modifyComment, deleteComment, getCommentById, getAllCommentByPost, deleteCommentAdmin  } from "../controller/CommentController";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/verifyRole";

const router = express.Router();

router.get("/:id", verifyTokenMiddleware, getCommentById);

/**
 * @swagger
 * tags:
 *   - name: Comment
 *     description: Gestion des commentaires
 */

/**
 * @swagger
 * /comment/{post_id}:
 *   post:
 *     summary: Créer un commentaire pour un post
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post concerné
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
 *     responses:
 *       200:
 *         description: Commentaire créé avec succès
 *       400:
 *         description: Erreur de validation ou utilisateur invalide
 *       403:
 *         description: Action interdite
 *       500:
 *         description: Erreur serveur
 */

router.post("/:post_id", verifyTokenMiddleware, createComment);

router.get("/allpost/:post_id", verifyTokenMiddleware, getAllCommentByPost);

/**
 * @swagger
 * /comment/user/{user_id}:
 *   get:
 *     summary: Récupérer tous les commentaires d'un utilisateur
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/user/:user_id", verifyTokenMiddleware, getAllCommentByUser);

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Modifier un commentaire
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
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
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       400:
 *         description: Utilisateur ou commentaire invalide
 *       403:
 *         description: Action non autorisée
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", verifyTokenMiddleware, deleteComment);

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Récupérer un commentaire par ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/commentid/:id", verifyTokenMiddleware, getCommentById);


router.delete("/admin/:id", isAdmin, deleteCommentAdmin)



export default router