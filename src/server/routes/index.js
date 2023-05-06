const dishes = require('../src/dishes/dishes');
// const users = require('../src/users/routes');


module.exports = (app) => {
    // app.use('/status', status);
    app.use('/dishes', dishes);
    // app.use('/users', validateAuth.checkIfAuthenticated, getData.getGeoip, users);
    app.use('*', (req, res) => {
        res.send('Not found!!!');
    });
};