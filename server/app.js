var express = require("express");
var app = express();
var { Pool, Client } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'heatmap',
    password: 'Olfert060191',
    port: 5432
});

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



router.get("/", function (req, res) {

    res.json({ message: 'Hello I am an api' });
});

router.get('/ping', function (req, res) {
    res.json({ message: 'ping ping!' });
});

router.post('/addNewPin', function (req, res) {
    var pointDetails;
    pointDetails = [req.body.title, req.body.subTitle, req.body.text, req.body.coorA, req.body.coorB, req.body.orgid];

    pool.connect(function (err, connection, release) {
        connection.query('INSERT INTO addedpoints (pointtitle, pointsubtitle, pointtext, pointcoora, pointcoorb, orgid) VALUES ($1, $2, $3, $4, $5, $6)', pointDetails, (error, results) => {
            if (error) {
                res.send('204');
                console.log("Error in Add: " + error);
            } else {
                console.log("succes, added point");
                res.send('200');
            }
            release();
        });
    });
});

router.get('/getAllPins', function (req, res) {
    pool.connect(function (err, connection, release) {
        connection.query('SELECT * FROM addedpoints', (error, results) => {
            res.json({
                results
            });
            release();
        });

    });
});

router.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, 5, function (err, bcryptedPassword) {
        var newUser;
        if(err){
            console.log(err);
        }else{
            newUser = [req.body.navn, req.body.email, bcryptedPassword, req.body.orgid];
        }
        pool.connect(function (err, connection, release) {
            connection.query('INSERT INTO users (navn, email, password, orgid) VALUES ($1, $2, $3, $4)', newUser, function (error, results) {
                if (error) {
                    res.send({
                        "code": 400,
                        "failed": error
                    });
                } else {
                    res.send({
                        "code": 200
                    });
                }
            });
        });
    });
});

router.post('/login', function (req, res) {
    pool.connect(function (err, connection, release) {
        console.log(req.body.email);
        connection.query('SELECT * FROM users WHERE email=$1', [req.body.email], function (error, results) {
            if (error) {
                // console.log("error ocurred",error);
                res.send({
                    "code": 400,
                    "failed": error
                })
            } else {

                if (results.rows.length == 1) {

                    bcrypt.compare(req.body.password, results.rows[0].password, function (err, doesMatch) {
                        if (doesMatch) {
                            res.send('200');
                        } else {
                            res.send('204');
                        }
                    });
                }
                else {
                    res.send('204');
                }
            }
            connection.release();
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
