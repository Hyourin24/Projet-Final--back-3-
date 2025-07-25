import Joi from "joi";

export const loginSchema = Joi.object({
    pseudo: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required()
});

// Définition du schéma de validation pour l'inscription
export const registerSchema = Joi.object({
    god_id: Joi.number().required(),
    pseudo: Joi.string().min(3).max(30).required()
    .messages({
        'string.empty': 'Le nom est requis.',
        'string.min': 'Le nom doit contenir au moins 3 caractères.',
        'string.max': 'Le nom ne peut pas dépasser 30 caractères.'
    }),
    password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[!@#$%^&*])(?=.*\d)/) // Au moins un caractère spécial et un chiffre
    .required()
    .messages({
        'string.empty' : 'Le mot de passe est requis.' ,
        'string.min': 'Le mot de passe doit contenir au moins 8 caractères.' ,
        'string.pattern.base' : 'Le mot de passe doit contenir au moins un chiffre et un caractère spécial.'
    }),
    email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
        'string.empty': "L'email est requis.",
        'string.pattern.base': "L'email doit être au format correct (ex: exemple@domaine.com)."
    }),
    role: Joi.string().valid('Admin', 'Utilisateur'),
    abonnement: Joi.string().valid('Abonné', 'Non abonné'),
    actif: Joi.string().valid('Actif', 'Suspendu'),
    etat: Joi.string().valid('Connecté', 'Déconnecté'),
});

