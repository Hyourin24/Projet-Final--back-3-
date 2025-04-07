import Joi from "joi";

// Définition du schéma de validation pour l'inscription
export const postSchema = Joi.object({
    titre: Joi.string().min(3).max(50).required()
    .messages({
        'string.empty': 'Le titre est requis.',
        'string.min': 'Le titre doit contenir au moins 3 caractères.',
        'string.max': 'Le titre ne peut pas dépasser 50 caractères.'
    }),
    post: Joi.string().min(3).max(1000).required()
    .messages({
        'string.empty' : 'Le champs post est requis.' ,
        'string.min': 'Le champs post doit contenir au moins 3 caractères.' ,
        'string.max' : 'Le champs post ne peut dépasser 1000 charactères'
    }),
});