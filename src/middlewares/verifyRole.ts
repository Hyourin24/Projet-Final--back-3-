import { NextFunction } from "express";
import {Request, Response} from "express";
import {verifyToken} from "../utils/JWTutils"

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.status(401).json({ message: 'Cookie manquant' });
        return
    }

    const match = cookieHeader.match(/(?:^|;\s*)jwt=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
        res.status(403).json({ message: 'Token invalide' });
        return
    }

    if (decoded.role !== 'Admin') {
        res.status(403).json({ message: 'Accès interdit : admin uniquement.' });
        return
    }

    // Optionnel : stocke les infos dans req pour usage ultérieur
    (req as any).user = decoded;

    next();
}

