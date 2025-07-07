import { NextFunction } from "express";
import {Request, Response} from "express";
import {verifyToken} from "../utils/JWTutils"

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    // Récupération du token depuis le cookie (compatible avec plusieurs cookies)
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.status(401).json({ message: 'Cookie manquant' });
        return;
    }

    // Recherche du cookie "jwt"
    const match = cookieHeader.match(/(?:^|;\s*)jwt=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return;
    }

    // Vérification et décodage du token
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string') {
        res.status(403).json({ message: 'Token invalide' });
        return;
    }

    // Vérifie que l'utilisateur est bien admin (booléen strict)
    if (decoded.role !== 'Admin') {
        res.status(403).json({ message: 'Accès interdit, vous devez être admin pour accéder à cette ressource' });
        return;
    }

    // Autorisé, passe au middleware suivant
    next();
}

