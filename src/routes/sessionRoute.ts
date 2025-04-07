import express from "express";
import { createSession, getAllSessionByUser, modifySession, deleteSession, getSessionById } from "../controller/SessionController";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Créer une session
 *     description: Permet à un utilisateur de créer une session
 *     tags:
 *       - Sessions
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - description
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de la session
 *               description:
 *                 type: string
 *                 description: Description de la session
 *     responses:
 *       201:
 *         description: Session créée avec succès
 *       400:
 *         description: Erreur de validation
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", verifyTokenMiddleware, createSession);

/**
 * @swagger
 * /sessions/{user_id}:
 *   get:
 *     summary: Récupérer toutes les sessions d'un utilisateur
 *     description: Retourne toutes les sessions créées par un utilisateur spécifique.
 *     tags:
 *       - Sessions
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
 *         description: Liste des sessions
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:user_id", verifyTokenMiddleware, getAllSessionByUser);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Modifier une session
 *     description: Met à jour une session existante.
 *     tags:
 *       - Sessions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la session à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nouveau nom de la session
 *               description:
 *                 type: string
 *                 description: Nouvelle description de la session
 *     responses:
 *       200:
 *         description: Session modifiée avec succès
 *       404:
 *         description: Session non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", verifyTokenMiddleware, modifySession);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Supprimer une session
 *     description: Supprime une session existante.
 *     tags:
 *       - Sessions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la session à supprimer
 *     responses:
 *       200:
 *         description: Session supprimée avec succès
 *       404:
 *         description: Session non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", verifyTokenMiddleware, deleteSession);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Récupérer une session par son ID
 *     description: Retourne une session spécifique.
 *     tags:
 *       - Sessions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la session
 *     responses:
 *       200:
 *         description: Session trouvée
 *       404:
 *         description: Session non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", verifyTokenMiddleware, getSessionById);


export default router