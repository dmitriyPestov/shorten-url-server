'use strict'
const Urls = require('../modeles/urls');
const UrlApi = require('url');
const db = require('../db/db');
const moment = require('moment');

exports.checkCreateDateInDB = function () {
    let dt = new Date();
    dt.setDate(dt.getDate() - 15);
    const timeForDeletion = +moment(dt);

    const countingTime = {
        'timeForDeletion': { $lt: timeForDeletion }
    };

    return new Promise( function (resolve, reject) {
        db.get().collection('url').remove(
            countingTime,
            function(err, result) {
                if (err) {
                    reject(error);
                }
            resolve(result);
        });
    });
};