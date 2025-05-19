import express from 'express'
import { createPost, modifyPost, getAllPost, getPostById, deletePost, getAllPostByUser} from '../controller/PostController'
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

router.put("/:id", verifyTokenMiddleware, modifyPost);

router.get("/all", verifyTokenMiddleware, getAllPost);


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

router.get("/user/:user_id", verifyTokenMiddleware, getAllPostByUser);


export default router;