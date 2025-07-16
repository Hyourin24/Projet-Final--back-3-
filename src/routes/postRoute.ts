import express from 'express'
import { createPost, modifyPost, getAllPost, getPostById, deletePost, getAllPostByUser, deletePostAdmin} from '../controller/PostController'
import { verifyTokenMiddleware } from '../middlewares/verifyToken';
import { isAdmin } from '../middlewares/verifyRole';



const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Post
 *     description: Gestion des posts utilisateurs
 */

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Créer un nouveau post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - post
 *             properties:
 *               titre:
 *                 type: string
 *               post:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post créé avec succès
 *       400:
 *         description: Champs manquants ou utilisateur non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post("/",  verifyTokenMiddleware, createPost);

/**
 * @swagger
 * /post/all:
 *   get:
 *     summary: Récupérer tous les posts
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les posts
 *       500:
 *         description: Erreur serveur
 */
router.get("/all", verifyTokenMiddleware, getAllPost);

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Récupérer un post par ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post
 *     responses:
 *       200:
 *         description: Post récupéré avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", verifyTokenMiddleware, getPostById);

/**
 * @swagger
 * /post/user/{user_id}:
 *   get:
 *     summary: Récupérer tous les posts d'un utilisateur
 *     tags: [Post]
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
 *         description: Liste des posts de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/user/:user_id", verifyTokenMiddleware, getAllPostByUser);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Modifier un post par ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               post:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post modifié avec succès
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", verifyTokenMiddleware, modifyPost);
/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Supprimer un post par ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post
 *     responses:
 *       200:
 *         description: Post supprimé avec succès
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", verifyTokenMiddleware, deletePost);

router.delete('/admin/:id', isAdmin, deletePostAdmin)



export default router;