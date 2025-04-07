import Joi from "joi";

export const commentSchema = Joi.object({
    post_id: Joi.number().integer().required(),
    comment: Joi.string().min(3).max(500).required()
    .messages({
        'string.empty': 'Le commentaire est requis.',
        'string.min': 'Le commentaire doit contenir au moins 3 caractères.',
        'string.max': 'Le commentaire ne peut pas dépasser 500 caractères.'
    }),
    
});