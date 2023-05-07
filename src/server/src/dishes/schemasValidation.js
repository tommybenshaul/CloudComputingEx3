const Joi = require('joi');

const schemas = {
    addDish: Joi.object().keys({
        name: Joi.string().required(),
    }),
};

module.exports = schemas;