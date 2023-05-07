const app = require('./app');
const config = require('./../config');

const PORT = process.env.PORT || config.port;

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = app.listen(PORT, () => {
    console.log('server is running on port', server.address().port);
});