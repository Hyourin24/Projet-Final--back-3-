import { Request, Response } from "express";
import Utilisateur from "../models/Utilisateur.model";
import sequelize from "../config/database";
import { validateSchema } from "../utils/joiUtils";
import { hashPassword, verifyPassword } from "../utils/pwdUtils";
import { loginSchema, registerSchema } from "../JoiValidator/AuthValidator";
import { generateToken } from "../utils/JWTutils";
import { Actif } from "../models/Utilisateur.model";
import God from "../models/God.models";

interface AuthRequest extends Request {
    user?: { id: number };
}

export async function register(req:Request, res:Response){
    try{
        const { god_id, pseudo, email, password, role, actif, etat, abonnement } = validateSchema(req, registerSchema);
        const { avatar, id} = req.body

        if(!pseudo || !email  || !password){
            res.status(400).send('Le champs name et password sont incomplets.');
            return 
        }
        
        const hashedPassword= await hashPassword(password);

        const utilisateurExistant = await Utilisateur.findOne({ where: { email } });
        const dieuExistant = await God.findByPk(god_id);
        if (utilisateurExistant) {
            res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
            return
        }
        if (!dieuExistant) {
            res.status(400).json({ message: "Le dieu avec cet ID n'existe pas." });
            return
        }
    
        const newUser = await Utilisateur.create({ id, god_id, avatar, pseudo, email,  hashedPassword, role, actif, etat, abonnement});
        const savedUser= await newUser.save();
        savedUser.hashedPassword = '';
        res.status(201).json({message: 'Utilisateur créé avec succès',data: savedUser});
    
    } catch(err:any){
        if(err.code===11000){
            res.status(400).json({message: 'Nom ou email déjà utilisé'});
            return 
        }
        res.status(500).json({message: 'Erreur interne', error: err.message});
    }
}

export async function login(req:Request, res:Response){
    try {
        const { pseudo, password } = validateSchema(req, loginSchema);
        const user= await Utilisateur.findOne({ where: { pseudo } });

        if(!user){
            res.status(404).json({message: 'Utilisateur non trouvé'});
            return 
        }

        if (user.actif === "Banni" ) {
            res.status(403).json({ message: "Compte temporairement suspendu jusqu'à " + user.bannedUntil });
            return         
        }

        const isPasswordValid= await verifyPassword(password,user.hashedPassword);
        if(!isPasswordValid){
            res.status(401).json({message: 'Mot de passe incorrect'});
            return 
        }
        const token = generateToken({id:user.id, role: user.role});
        console.log("DEBUG - Token généré :", token);
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({message: 'Connexion réussie', token, user: user.id});
        console.log("DEBUG - ID utilisateur utilisé pour la session :", user.id);

    }catch(error:any){
        res.status(500).json({message: error.message});
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const utilisateurs = await Utilisateur.findAll();
        res.send(utilisateurs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getUserById(req: AuthRequest, res: Response) {
    try {
        const {id} = req.params
        const user = await Utilisateur.findByPk(id);

        if (!user) {
            res.status(404).json({ message: "Utilisateur introuvable." });
            return;
        }

        res.status(200).json(user);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur." });
        return;
    }
}


import { v2 as cloudinary } from 'cloudinary';

export async function modifyUser(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id
        const { pseudo, email, avatar } = req.body;

        const utilisateur = await Utilisateur.findOne({where: {id: userId }});
        if (!utilisateur) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return
        }

        // Mise à jour des champs fournis
        if (pseudo) utilisateur.pseudo = pseudo;
        if (email) utilisateur.email = email;

        if (avatar) {
            console.log('Avatar reçu pour update :', avatar);

            const uploadResult = await cloudinary.uploader.upload(avatar, {
                folder: 'avatars',
                public_id: `avatar_${userId}_${Date.now()}`,
                overwrite: true,
                resource_type: "image",
            });

            utilisateur.avatar = uploadResult.secure_url;
        }

        await utilisateur.save();
        res.status(200).json({ message: "Utilisateur modifié avec succès", utilisateur });
    } catch (error: any) {
        console.error("Erreur lors de la modification :", error.message, error);
        res.status(500).json({ message: "Erreur du serveur" });
    }
}


export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const utilisateur = await Utilisateur.findByPk(id);
        if (!utilisateur) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return
        }

        await utilisateur.destroy();
        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur du serveur" });
    }
}

export async function getMe(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Non autorisé" });
            return
        }

        const utilisateur = await Utilisateur.findOne({ where: { id: userId } });
        if (!utilisateur) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return
        }

        res.json(utilisateur);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur du serveur" });
    }
}


/**
 * Effectue une recherche avancée sur les utilisateurs.
 * Filtrage par nom, email et date de création avec une requête SQL optimisée.
 * URL : GET /users/search?nom=Dupont&email=dupont@example.com&createdAfter=2024-01-01
 */
export async function searchUsers(req: Request, res: Response) {
    try {
        const { pseudo, email, createdAfter } = req.query;

        //Créé une requête formatée pour que sequelize puisse insérer des variables à l'intérieur
        const query = `
            SELECT id, pseudo, email, "createdAt"
            FROM "Utilisateur"
            WHERE
                (:pseudo IS NULL OR pseudo ILIKE :pseudo) AND
                (:email IS NULL OR email ILIKE :email) AND
                (:createdAfter IS NULL OR "createdAt" >= :createdAfter)
            ORDER BY pseudo ASC;
        `;

        //insère dynamiquement les variables dans la requête et l'éxécute
        //sequelize.query avec replacements protège contre les injections sql
        const utilisateurs = await sequelize.query(query, {
            replacements: {
                pseudo: pseudo ? `%${pseudo}%` : null, // Recherche partielle insensible à la casse
                email: email ? `%${email}%` : null,
                createdAfter: createdAfter || null,
            },
            type: "SELECT"
        });

        res.json(utilisateurs);
    } catch (error: any) {
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ message: error.message });
    }
}


export async function modifyRole(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const utilisateur = await Utilisateur.findByPk(id);
        if (!utilisateur) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return
        }

        // Mise à jour des champs fournis
        if (role) utilisateur.role = role;

        await utilisateur.save();
        res.status(200).json({ message: "Utilisateur modifié avec succès", utilisateur });
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur au serveur" });
    }
}

export async function modifyActif(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      const utilisateur = await Utilisateur.findByPk(id);
      if (!utilisateur) {
        res.status(404).json({ message: "Utilisateur non trouvé" });
        return
      }
  
      // Inversion de l'état actif/inactif
      utilisateur.actif = utilisateur.actif === Actif.actif ? Actif.banni : Actif.actif;
  
      await utilisateur.save();
  
      res.status(200).json({ message: "Utilisateur modifié avec succès", utilisateur });
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      res.status(500).json({ message: "Erreur sur serveur" });
    }
  }
  