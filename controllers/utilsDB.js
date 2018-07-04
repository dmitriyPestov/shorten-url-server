'use strict'
const Urls = require('../modeles/urls');
const UrlApi = require('url');
const db = require('../db/db');
const moment = require('moment');

exports.checkCreateDateInDB = function () {
    let d = new Date();
    d.setDate(d.getDate() - 15);
    let timeForDeletion = +moment(d);

    let df = {
        'timeForDeletion': { $lt: timeForDeletion }
    };

    return new Promise( function (resolve, reject) {
        db.get().collection('url').remove(
            df,
            function(err, result) {
                if (err) {
                    console.log(err);
                    reject(error);
                }
            resolve(result);
        });
    });
};