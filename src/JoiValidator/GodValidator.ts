import Joi from "joi";
import God from "../models/God.models";

export const GodSchema = Joi.object({
    nom: Joi.string().min(1).max(100).required()
    .messages({
        'string.empty': 'Le nom du Dieu est requis.',
        'string.min': 'Le nom du Dieu doit contenir au moins 1 caractère.',
        'string.max': 'Le nom du Dieu ne peut pas dépasser 100 caractères.'
    }),
    description: Joi.string().max(300).required()
    .messages({
        'string.max': 'La description du Dieu ne peut pas dépasser 3000 caractères.'
    }),
    mythologie: Joi.string().valid('Grec', 'Romain', 'Égyptien', 'Nordique', 'Celte', 'Chinois', 'Japonais', 'Hindoue').required(),
    image_url: Joi.string().uri().required()
});