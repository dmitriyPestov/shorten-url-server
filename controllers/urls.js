'use strict'
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const UrlApi = require('url');
const Urls = require('../modeles/urls');
const db = require('../db/db');
const {config} = require('../utils/config');
const request = require('request');

exports.all = function (req,res) {
    Urls.all(function(err, docs) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    });
};

function checkShortID (shortEntry) {
    return new Promise( function (resolve, reject) {
        db.get().collection('url').findOne(
            { shortEntry: shortEntry },
            function(err, result) {
                if (err) {
                    reject(error);
                }
                if(result)
                    resolve(result);
                else
                    resolve(null);
        });
    });
}

function updateCount (countcall, id) {
    return new Promise( function (resolve, reject) {
        db.get().collection('url').update(
            {'_id': ObjectID(id)},
            {$set: {countcall: countcall}},
            function(err, result) {
                if (err) {
                    reject(error);
                }
                resolve(true);
        });
    });
}

exports.findByShortId = function (req, res) {
    checkShortID (req.params.id).then(
        response => {
            if( response ) {
                let countcall = ++(response.countcall) || 0;
                let redirectUrl = response.longurl;
                if(response) {
                    updateCount(countcall, response._id).then(
                        response => {
                            res.redirect(redirectUrl);
                        },
                        error => console.log('Rejected error updateCount: ', error)
                    );
                }
            } else {
                res.status(404).send({ status: 'Not Found in DB' });
            }
        },
        error => console.log('Rejected error checkShortID: ', error)
    );
};

function checkshortEntry (shortEntry) {
    return new Promise( function (resolve, reject) {
        db.get().collection('url').findOne(
            { shortEntry: shortEntry },
            function(err, result) {
                if (err) {
                    reject(error);
                }
                if(result)
                    resolve(true);
                else
                    resolve(false);
        });
    });
}

function checkUrlInDB (searchObj) {
    return new Promise( function (resolve, reject) {
        db.get().collection('url').findOne(
            searchObj,
            function(err, result) {
                if (err) {
                    reject(error);
                }
            resolve(result);
        });
    });
}

function createShortEntry() {
    let shortEntry='';
    const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm';
    const LettersSize = letters.length;
    const CountSymbolshortEntry = 7;
    for(let i=0; i<CountSymbolshortEntry; i++) {
        shortEntry += letters[Math.floor(Math.random() * LettersSize)];
    }
    return shortEntry;
}

function writeToDB(status, shortEntry, res, req) {
    if (status) {
        return res.status(500).send({status: 'This name is already in use! Choose a different name.'});
    } else {
        const shorturl = config.serverHost + shortEntry;

        const urlData = {
            longurl: req.body.longurl,
            shorturl : shorturl,
            countcall : 0,
            shortEntry: shortEntry,
            date: moment().format("DD-MMM-YYYY"),
            timeForDeletion: +moment()
        }

        Urls.create(
            urlData,
            function(err, doc) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                res.send(urlData);
        });
    }
}

function isValidExternalUrl (url) {
    return new Promise( function (resolve, reject) {
        request(url, function (error, response, body) {
            if (error) {
                    reject(error);
            }
            if(response && response.statusCode == 200) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    })
}

exports.create = function (req, res) {
    let shortEntry = '';
    let status = 0;
    if(req.body && req.body.longurl) {
        isValidExternalUrl(req.body.longurl)
        .then(response => {
            console.log('isValidExternalUrl : ', response);
            if (response) {
                const searchObj = { longurl: req.body.longurl};
                checkUrlInDB(searchObj)
                .then( response => {
                    let longurlInDB = response === null ? '' : response.longurl === null ? '' : response.longurl;

                    if (longurlInDB === req.body.longurl) {
                        return res.status(500).send({status : 'This Address is already in the database!'});
                    }

                    if ( req.body && req.body.shortPartUserUrl && req.body.shortPartUserUrl != "" ) {
                        shortEntry = req.body.shortPartUserUrl;
                        checkshortEntry (shortEntry)
                        .then( response => {
                            if (response) {
                                status = 1;
                            }
                            writeToDB(status, shortEntry, res, req);
                        },
                        error => console.log('Rejected: ',error)
                        );
                    } else {
                        //create short url
                        shortEntry = createShortEntry();
                        checkshortEntry (shortEntry)
                        .then( response => {
                            if (response) {
                                shortEntry = createShortEntry();
                            }
                            writeToDB(status, shortEntry, res, req);
                        },
                        error => console.log('Rejected: ',error)
                        );
                    }
                },
                error => console.log('Rejected 1: ',error)
                );
            }
        },
        error => {
            return res.status(500).send({ status: 'You entered an incorrect address!' });
        })
    } else {
        return res.status(500).send({ status: 'You do not input address!'});
    }
};

exports.update = function (req, res) {
    Urls.update(
        req.params.id,
        req.body.longurl,
        function(err, doc) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
    });
};

exports.delete = function (req, res) {
    Urls.delete(
        req.params.id,
        function(err, doc) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
    });
};
