const inputs = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        const valid = error == null;
        if (valid) next();
        else {
            const { details } = error;
            res.status(422).send("-1");
        }
    };
};

module.exports = { inputs };