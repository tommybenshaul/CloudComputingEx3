const dishes = require('../src/dishes/dishes');
const meals = require('../src/meals/meals');
// const users = require('../src/users/routes');


module.exports = (app) => {
    // app.use('/status', status);
    app.use('/dishes', dishes);
    app.use('/meals', meals);
    // app.use('/users', validateAuth.checkIfAuthenticated, getData.getGeoip, users);
    app.use('*', (req, res) => {
        res.status(404).send('Not found!!!');
    });
};