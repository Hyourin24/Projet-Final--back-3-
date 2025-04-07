import express from "express";
import { login, register } from "../controller/UserController";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     description: Crée un nouvel utilisateur et retourne un token d'authentification.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mail
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "JohnDoe"
 *               mail:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPass123!"
 *               role:
 *                 type: string
 *                 enum: ["Utilisateur", "Modérateur", "Admin"]
 *                 example: "Modérateur"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "JohnDoe"
 *                     mail:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "Modérateur"
 *       400:
 *         description: Requête invalide (champs manquants ou email déjà utilisé)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nom ou email déjà utilisé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne"
 */

router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur existant avec un nom et un mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jean Dupont"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Passw0rd!"
 *     responses:
 *       200:
 *         description: Connexion réussie avec génération d'un cookie JWT
 *         headers:
 *           Set-Cookie:
 *             description: Cookie contenant le token JWT
 *             schema:
 *               type: string
 *               example: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *       401:
 *         description: Mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mot de passe incorrect"
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
 *                   example: "Erreur interne"
 */
router.post('/login', login);

export default router;