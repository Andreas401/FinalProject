var express = require("express");
var app = express();
const bodyParser = require('body-parser');


const router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});
app.set('port', 3000)
app.use('/api', router);

var { Pool, Client } = require('pg');

//DB connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'heatmap',
    password: 'password',
    port: 5432
});



router.get('/getAllPins', function (req, res) {
    pool.connect(function (err, connection, release) {
        connection.query('SELECT * FROM addedpoints', (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.json({
                    results
                });
            }
            release();
        });

    });
});


app.listen(app.get('port'), function (err) {
    if (err) {
        console.log("Failed to start the server on port %d", app.get('port'));
    } else {
        console.log("Server is running on port %d", app.get('port'));
    }
});