'use strict'
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db = require('./db/db');
const urlsController = require('./controllers/urls');
const cron = require('node-cron');
const utilsDB = require('./controllers/utilsDB');
const mongoose = require('mongoose');
const path = require('path');
const {config} = require('./utils/config');

const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors());

const task = cron.schedule('0 10 3 * * *', function() {
  utilsDB.checkCreateDateInDB();
}, false);
task.start();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
             'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', urlsController.all);
app.get('/:id', urlsController.findByShortId);
app.post('/url', urlsController.create);
app.put('/urls/:id', urlsController.update);
app.delete('/urlid/:id', urlsController.delete);

db.connect( config.databaseHost, function (err) {
    if (err) {
        console.log(err);
    }

    const port = 8000;
    app.listen(process.env.PORT || port, function() {
        console.log('API app started. Port :', port);
        console.log(Date());
    });
});