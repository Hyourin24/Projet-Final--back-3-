import express from "express";
import { followUser, isFollowing, unfollowUser, getFollower, getFollowing, getFollowersByUserId, getFollowingByUserId } from "../controller/FollowerController";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Follow
 *     description: Système d'abonnement entre utilisateurs
 */

/**
 * @swagger
 * /follow/{abonne_id}:
 *   post:
 *     summary: S'abonner à un utilisateur
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: abonne_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à suivre
 *     responses:
 *       201:
 *         description: Abonnement réussi
 *       400:
 *         description: Requête invalide ou déjà abonné
 *       403:
 *         description: Action interdite
 *       500:
 *         description: Erreur serveur
 */
router.post('/:abonne_id', verifyTokenMiddleware, followUser)

/**
 * @swagger
 * /follow/{abonne_id}/status:
 *   get:
 *     summary: Vérifier si l'utilisateur actuel suit un autre utilisateur
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: abonne_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à vérifier
 *     responses:
 *       200:
 *         description: Statut de l'abonnement
 *       400:
 *         description: Paramètres manquants
 *       500:
 *         description: Erreur serveur
 */
router.get('/:abonne_id/status', verifyTokenMiddleware, isFollowing) 

/**
 * @swagger
 * /follow/{abonne_id}:
 *   delete:
 *     summary: Se désabonner d'un utilisateur
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: abonne_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à ne plus suivre
 *     responses:
 *       200:
 *         description: Désabonnement réussi
 *       400:
 *         description: Données manquantes ou utilisateur invalide
 *       404:
 *         description: Abonnement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:abonne_id', verifyTokenMiddleware, unfollowUser)

/**
 * @swagger
 * /follow/following:
 *   get:
 *     summary: Récupérer la liste des utilisateurs suivis par l'utilisateur connecté
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des abonnements
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur serveur
 */
router.get('/following', verifyTokenMiddleware, getFollowing)

/**
 * @swagger
 * /follow/follower:
 *   get:
 *     summary: Récupérer la liste des abonnés de l'utilisateur connecté
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des abonnés
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur serveur
 */
router.get('/follower', verifyTokenMiddleware, getFollower)

/**
 * @swagger
 * /follow/following/{id}:
 *   get:
 *     summary: Récupérer la liste des utilisateurs suivis par un utilisateur spécifique
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur concerné
 *     responses:
 *       200:
 *         description: Liste des abonnements
 *       500:
 *         description: Erreur serveur
 */
router.get('/following/:id',  getFollowingByUserId)

/**
 * @swagger
 * /follow/follower/{id}:
 *   get:
 *     summary: Récupérer la liste des abonnés d'un utilisateur spécifique
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur concerné
 *     responses:
 *       200:
 *         description: Liste des abonnés
 *       500:
 *         description: Erreur serveur
 */
router.get('/follower/:id',  getFollowersByUserId)


export default router