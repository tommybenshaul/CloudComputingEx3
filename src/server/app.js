const express = require('express');
const bodyParser = require('body-parser');

const app = express();
function checkContentType(req, res, next) {
    if (req.method === "POST" && req.headers["content-type"] !== "application/json") {
        return res.status(415).send("0");
    }
    next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(checkContentType);



app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, DELETE'
    );

    // Request headers you wish to allow
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



require('./routes')(app);


module.exports = app;