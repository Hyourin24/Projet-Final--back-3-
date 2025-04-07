import expess from 'express';
import {deleteUser, getAllUsers, modifyUser, searchUsers, modifyRole, modifyActif, getLoginUser } from '../controller/UserController';
import { verifyTokenMiddleware } from '../middlewares/verifyToken';
import { isAdmin } from '../middlewares/verifyRole';


const router = expess.Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64a2b8f4e6c4b2a3d5e8f7c1"
 *                   pseudo:
 *                     type: string
 *                     example: "JohnDoe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *       401:
 *         description: Accès refusé, jeton invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Accès refusé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.get('/', getAllUsers, verifyTokenMiddleware);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modifie les informations d'un utilisateur existant
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "NouveauNom"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nouveau.email@example.com"
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur modifié avec succès"
 *                 utilisateur:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64a2b8f4e6c4b2a3d5e8f7c1"
 *                     pseudo:
 *                       type: string
 *                       example: "NouveauNom"
 *                     email:
 *                       type: string
 *                       example: "nouveau.email@example.com"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.put('/', verifyTokenMiddleware, modifyUser);


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur existant
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.delete('/:id', deleteUser, verifyTokenMiddleware);


/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Recherche des utilisateurs par pseudo, email ou date de création
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pseudo
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrer par pseudo (recherche partielle insensible à la casse)
 *         example: "John"
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: false
 *         description: Filtrer par email (recherche partielle insensible à la casse)
 *         example: "example@example.com"
 *       - in: query
 *         name: createdAfter
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filtrer par date de création après une date spécifique
 *         example: "2023-01-01T00:00:00Z"
 *     responses:
 *       200:
 *         description: Liste des utilisateurs correspondant aux critères de recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64a2b8f4e6c4b2a3d5e8f7c1"
 *                   pseudo:
 *                     type: string
 *                     example: "JohnDoe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:34:56Z"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.get('/me', verifyTokenMiddleware, getLoginUser)

router.get('/search', searchUsers, verifyTokenMiddleware);

router.put('/role/:id', verifyTokenMiddleware, isAdmin, modifyRole);

router.put('/actif/:id', verifyTokenMiddleware, isAdmin, modifyActif);



export default router;