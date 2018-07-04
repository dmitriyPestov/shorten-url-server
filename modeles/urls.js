'use strict'
const db = require('../db/db');
const ObjectID = require('mongodb').ObjectID;

exports.all = function (cb) {
    db.get().collection('url').find().toArray(
        function(err, docs) {
            cb(err, docs);
        }
    )
}

exports.findByShortId = function (id, cb) {
    db.get().collection('url').findOne(
        { shortening: id },
        function(err, doc) {
            cb(err, doc);
        }
    );
}

exports.create = function (longurl, cb) {
    db.get().collection('url').insert(
        longurl,
        function(err, result) {
            cb(err, result);
        }
    );
}

exports.update = function (id, newData, cb) {
    db.get().collection('url').updateOne(
        { '_id' : ObjectID(id) },
        newData,
        function(err, result) {
            cb(err, result);
        }
    );
}

exports.delete = function (id, cb) {
    db.get().collection('url').deleteOne(
        { '_id': ObjectID(id) },
        function(err, result) {
            cb(err, result);
        }
    );
}
