'use strict'
const MongoClient = require('mongodb').MongoClient;
const {config} = require('../utils/config');

const state = {
    db: null
};

exports.connect = function (url, done) {
    if(state.db) {
        return done();
    }

    MongoClient.connect(url, function (err, db) {
        if (err) {
            return done(err);
        }
        state.db = db;
        state.db = db.db(config.databaseName);
        done();
    });
};


exports.get = function () {
    return state.db;
}