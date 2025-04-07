import Joi from "joi";
import Utilisateur from "../models/Utilisateur.model";

export const sessionSchema = Joi.object({
    nom: Joi.string().min(3).max(50).required()
    .messages({
        'string.empty': 'Le nom de la session est requis.',
        'string.min': 'Le nom de lasession doit contenir au moins 5 caractères.',
        'string.max': 'Le nom de la session ne peut pas dépasser 50 caractères.'
    }),
    description: Joi.string().max(5000).required()
    .messages({
        'string.max': 'La description de la session ne peut pas dépasser 5000 caractères.'
    }),
});