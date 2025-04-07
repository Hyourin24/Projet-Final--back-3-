import { NextFunction } from "express";
import {Request, Response} from "express";
import {verifyToken} from "../utils/JWTutils"

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const cookie = req.headers.cookie;

    if (!cookie) {
        console.log("DEBUG - Cookie manquant");
        res.status(401).json({ message: 'Cookie manquant' });
        return
    }

    const token = cookie.split('=')[1];
    if (!token) {
        console.log("DEBUG - Token manquant");
        res.status(401).json({ message: 'Token manquant' });
        return
    }

    const decoded = verifyToken(token);
    console.log("DEBUG - Contenu du token :", decoded);

    if (!decoded || typeof decoded === 'string') {
        console.log("DEBUG - Token invalide");
        res.status(403).json({ message: 'Token invalide' });
        return
    }

    if (decoded.role !== "Admin") {
        console.log("DEBUG - Accès interdit, rôle :", decoded.role);
        res.status(403).json({ message: 'Accès interdit, vous devez être admin pour accéder à cette ressource' });
        return
    }

    console.log("DEBUG - Accès autorisé !");
    next();
}
