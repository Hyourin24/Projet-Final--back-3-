import Joi from "joi";

export const commentSchema = Joi.object({

    comment: Joi.string().min(1).max(500).required()
    .messages({
        'string.empty': 'Le commentaire est requis.',
        'string.min': 'Le commentaire doit contenir au moins 1 caractère.',
        'string.max': 'Le commentaire ne peut pas dépasser 500 caractères.'
    }),
    
});