import express from 'express'
import { createPost, modifyPost, getAllPostByUserWithComm, getAllPostByUser, getPostById, deletePost, getPostMe } from '../controller/PostController'
import { verifyTokenMiddleware } from '../middlewares/verifyToken';



const router = express.Router();


/**
 * @swagger
 * /post:
 *   post:
 *     summary: Créer un post
 *     description: Permet à un utilisateur de créer un post
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
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
 *                 description: Titre du post
 *               post:
 *                 type: string
 *                 description: Contenu du post
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *       400:
 *         description: Erreur de validation
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/",  verifyTokenMiddleware, createPost);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Modifier un post
 *     description: Met à jour un post existant.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du post à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 description: Nouveau titre du post
 *               post:
 *                 type: string
 *                 description: Nouveau contenu du post
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
 * /post/{user_id}:
 *   get:
 *     summary: Récupérer tous les posts d'un utilisateur
 *     description: Renvoie tous les posts créés par un utilisateur spécifique.
 *     tags:
 *       - Posts
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
 *         description: Liste des posts
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:user_id", verifyTokenMiddleware, getAllPostByUser);

/**
 * @swagger
 * /post/withComments/{user_id}:
 *   get:
 *     summary: Récupérer tous les posts d'un utilisateur avec leurs commentaires
 *     description: Renvoie tous les posts créés par un utilisateur avec les commentaires associés.
 *     tags:
 *       - Posts
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
 *         description: Liste des posts avec commentaires
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/withComments/:user_id", verifyTokenMiddleware, getAllPostByUserWithComm);

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Récupérer un post par son ID
 *     description: Retourne un post spécifique.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du post
 *     responses:
 *       200:
 *         description: Post trouvé
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", verifyTokenMiddleware, getPostById);

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Supprimer un post
 *     description: Supprime un post existant.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du post à supprimer
 *     responses:
 *       200:
 *         description: Post supprimé avec succès
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", verifyTokenMiddleware, deletePost);

router.get("/", verifyTokenMiddleware, getPostMe)




export default router;