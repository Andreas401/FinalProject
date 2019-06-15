var express = require("express");
var app = express();
var { Pool, Client } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
var mqtt = require('mqtt');
var fs = require('fs');
var de = require('./Modules/decoder.js');


//DB connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'heatmap',
    password: 'password',
    port: 5432
});

const router = express.Router();

var cert = fs.readFileSync('./cert/ca-certificates.crt');




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});
app.set('port', 3000)
app.use('/api', router);

var mqttOptions = {
    port: 8883,
    host: 'mqtts://lora.zibrawireless.dk',
    username: 'Adeunis',
    password: 'skovprojekt',
    keepalive: 60,
    cert: cert
}

var mqttClient = mqtt.connect('mqtts://lora.zibrawireless.dk', mqttOptions);
mqttClient.on('connect', function () {
    mqttClient.subscribe('#', function (err) {
        if (err) {
            console.log(err);
        }
    });
});

mqttClient.on('message', function (topic, message) {

    var myMessage = JSON.parse(message);
    var pointDetails;
    var hex;
    var adeunisPoint;

    if (myMessage.hasOwnProperty('rxInfo')) {
        pointDetails = [myMessage.rxInfo[0].name, myMessage.deviceName, myMessage.rxInfo[0].rssi, myMessage.rxInfo[0].location.latitude, myMessage.rxInfo[0].location.longitude, 1, 1];
        console.log("My array: " + pointDetails);
    }
    if (myMessage.hasOwnProperty('data')) {
        var data = Buffer.from(myMessage.data.toString(), 'base64');
        //console.log("data string: " + data);
        var deData = de.Decoder(data);
        console.log(deData);
        adeunisPoint = [myMessage.deviceName, myMessage.rxInfo[0].name, myMessage.rxInfo[0].rssi, deData.ranger.lat, deData.ranger.lon, 1, 2]
    }
    pool.connect(function (err, connection, release) {
        connection.query('INSERT INTO addedpoints (pointtitle, pointsubtitle, pointtext, pointcoora, pointcoorb, orgid, added) VALUES ($1, $2, $3, $4, $5, $6, $7)', pointDetails, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log("success");
            }

        });
        connection.query('INSERT INTO addedpoints (pointtitle, pointsubtitle, pointtext, pointcoora, pointcoorb, orgid, added) VALUES ($1, $2, $3, $4, $5, $6, $7)', adeunisPoint, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log("success");
            }
            release();
        });
    });
});



router.get("/", function (req, res) {

    res.json({ message: 'This is the Heatmap api' });
});

router.get('/ping', function (req, res) {
    res.json({ message: 'Successful connection' });
});


//Add new point in DB
router.post('/addNewPin', function (req, res) {
    var pointDetails;
    pointDetails = [req.body.title, req.body.subTitle, req.body.text, req.body.coorA, req.body.coorB, req.body.orgid, 3];

    pool.connect(function (err, connection, release) {
        //SQL query
        connection.query('INSERT INTO addedpoints (pointtitle, pointsubtitle, pointtext, pointcoora, pointcoorb, orgid, added) VALUES ($1, $2, $3, $4, $5, $6, $7)', pointDetails, (error, results) => {
            if (error) {
                console.log("Error in Add: " + error);
                res.send('204');
            } else {
                console.log("succes, added point");
                res.send('200');
            }
            release();
        });
    });
});


//Deleting point in DB
router.post('/deletePin', function (req, res) {
    var pinDetails = [req.body.pinid];
    pool.connect(function (err, connection, release) {
        connection.query('DELETE FROM addedpoints WHERE pointid = $1', pinDetails, function (error, results) {
            if (error) {
                console.log("pin was not deleted");
                res.send('204');
            } else {
                console.log("pin was deleted");
                res.send('200');

            }
            release();
        });
    });
});


//Getting all points from the DB
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

//Editing specific point in the DB
router.post('/editPoint', function (req, res) {
    pool.connect(function (err, connection, release) {
        var pointDetails;
        pointDetails = [req.body.title, req.body.subTitle, req.body.text, req.body.pinid];
        connection.query('UPDATE addedpoints SET pointtitle=$1, pointsubtitle=$2, pointtext=$3 WHERE pointid=$4', pointDetails, function (error, results) {
            if (error) {
                console.log(error);
                res.send("204")
            } else {
                console.log("pin was edited");
                res.send("200");
            }
            release();
        });
    });
});


//Getting all "kommuner" from DB
router.get('/getKommuner', function (req, res) {
    pool.connect(function (err, connection, release) {
        connection.query('SELECT * FROM kommuner', (error, results) => {
            console.log("kommuner api: " + JSON.stringify(results.rows));

            res.json({
                results
            });
            release();
        });

    });
});

//Registering a new user
router.post('/register', function (req, res) {
    console.log("registering");
    bcrypt.hash(req.body.password, 5, function (err, bcryptedPassword) {
        var newUser;
        if (err) {
            console.log(err);
        } else {
            newUser = [req.body.navn, req.body.email, bcryptedPassword, req.body.orgid];
        }
        pool.connect(function (err, connection, release) {
            connection.query('INSERT INTO users (navn, email, password, orgid) VALUES ($1, $2, $3, $4)', newUser, function (error, results) {
                if (error) {
                    res.send({
                        "code": 204,
                        "failed": error
                    });
                } else {
                    res.send({
                        "code": 200
                    });
                }
                release();
            });
        });
    });
});


//Login in a user
router.post('/login', function (req, res) {
    pool.connect(function (err, connection, release) {
        console.log(req.body.email);
        connection.query('SELECT * FROM users WHERE email=$1', [req.body.email], function (error, results) {
            if (error) {
                // console.log("error ocurred",error);
                res.send({
                    "code": 204,
                    "failed": error
                })
            } else {

                if (results.rows.length == 1) {

                    bcrypt.compare(req.body.password, results.rows[0].password, function (err, doesMatch) {
                        if (doesMatch) {

                            res.send({
                                "code": 200,
                                "orgid": results.rows[0].orgid
                            });
                        } else {
                            res.send('204');
                        }
                    });
                }
                else {
                    res.send('204');
                }
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
