const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const server = http.createServer(app);
require('dotenv').config();
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");

const cors = require('cors');
const bodyParser = require('body-parser')
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json()); // to support JSON-encoded bodies

// Requiring Routes

const UsersRoutes = require('./routes/user.route');

// config mongodb
const mongoCon = process.env.MongoURL;

// mongoose.connect(mongoCon);
mongoose.connect(mongoCon, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });



const fs = require('fs');
fs.readdirSync(__dirname + "/models").forEach(function(file) {
    require(__dirname + "/models/" + file);
});

// in case you want to serve images 
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.status(200).send({
        message: 'Express backend server'
    });
});

app.set('port', (3000));

app.use(accessControls);
app.use(cors());

// Routes which should handle requests
app.use("/auth", UsersRoutes);


app.use(errorHandler);

app.use(errorMessage);

server.listen(process.env.PORT || 3000);