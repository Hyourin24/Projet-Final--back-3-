import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Utilisateur from "../models/Utilisateur.model";
import { verifyToken } from "../utils/JWTutils";

interface AuthRequest extends Request {
    user?: { id: number };
}

const SECRET_KEY = process.env.SECRET_KEY;

// export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
//     //Vérification de la clé secrète et gestion d'erreur
//     if (SECRET_KEY === undefined) {
//         throw new Error("SECRET_KEY non présente dans les variables d'environnement")
//     }
//     //Récupération du cookie dans le header
//     const cookie = req.headers.cookie;
//     //Gestion d'erreur
//     if (!cookie) {
//         res.status(401).json({ message: "Access denies. COokie missing" });
//         return;
//     }
//      // Récupération du token dans le cookie après "="
//     const token = cookie.split('=')[1];
//     console.log(token);
//     //Gestion d'erreur
//     if (!token) {
//         res.status(401).json({ message: 'Access Denied. Token Missing.' })
//         return;
//     }
//     try {
//         //Vérification du token
//         const decoded = verifyToken(token);
//         //Décodage du token en JSON en payload
//         req.headers.payload = JSON.stringify(decoded);
//         //Gestion d'erreur
//         if (!decoded) {
//             res.status(403).send({ message: 'Token invalide ou expiré' })
//             return
//         }
//         next();
//     } catch (error: any) {
//         res.status(500).json({ message: error.message })
//     }
// }

export function verifyTokenMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    if (!SECRET_KEY) {
        throw new Error("SECRET_KEY non présente dans les variables d'environnement");
    }
    const cookie = req.headers.cookie;
    console.log("DEBUG - Cookies reçus :", req.headers.cookie);
    if (!cookie) {
        res.status(401).json({ message: "Access denied. Cookie missing." });
        return
    }
    const cookies = cookie.split("; ").reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);
    const token = cookies["jwt"]; 
    if (!token) {
        res.status(401).json({ message: "Access denied. Token missing." });
        return;
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
        req.user = decoded;
        console.log("Utilisateur authentifié :", req.user);
        next();
    } catch (error: any) {
        res.status(403).json({ message: "Token invalide ou expiré" });
        return
    }
}