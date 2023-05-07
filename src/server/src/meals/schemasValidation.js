const Joi = require('joi');

const schemas = {
    addMeal: Joi.object().keys({
        name: Joi.string().required(),
        appetizer: Joi.number().required(),
        main: Joi.number().required(),
        dessert: Joi.number().required()
    }),
};

module.exports = schemas;