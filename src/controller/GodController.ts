import { Request, Response } from "express";
import { validateSchema } from "../utils/joiUtils";
import { GodSchema } from "../JoiValidator/GodValidator";
import God from "../models/God.models";

export async function createGod(req: Request, res: Response) {
    try {

        // Validation des champs
        const { nom, description, mythologie, image_url } = validateSchema(req, GodSchema);
        const id = req.body.id;

        // Vérification d'un dieu déjà existant
        const dieuExistant = await God.findOne({ where: { nom } });
        if (dieuExistant) {
            res.status(403).json({ message: "Dieu déjà existant" });
            return
        }

        // Création du dieu avec l'image URL de Cloudinary
        const nouveauDieu = await God.create({id, nom, description, mythologie, image_url});

        res.status(201).json(nouveauDieu);
    } catch (err: any) {
        console.error("Erreur lors de la création du dieu :", err);
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

export async function modifyGod(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nom, description, mythologie, image_url } = validateSchema(req, GodSchema)

        const godUser = await God.findByPk(id);
        if (!godUser) {
            res.status(404).json({ message: "Dieu non trouvé" });
            return
        }


        if (nom) godUser.nom = nom;
        if (description) godUser.description = description;
        if (mythologie) godUser.mythologie = mythologie;
        if (image_url) godUser.image_url = image_url;

        await godUser.save();
        res.status(200).json({ message: "Dieu modifié avec succès", godUser});
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function deleteGod(req: Request, res: Response) {
    try {
        const {id } = req.params;

        const godUser = await God.findByPk(id);
        if (!godUser) {
            res.status(404).json({ message: "Dieu non trouvé" });
            return
        }

        await godUser.destroy();
        res.json({ message: "Dieu supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function getAllGod(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const godUser = await God.findAll();
        if (!godUser) {
            res.status(404).json({ message: "Dieu non trouvé"})
        }
        res.send(godUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}