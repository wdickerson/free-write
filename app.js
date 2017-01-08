"use strict";
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const fwc = require('./free-write-config');

const port = process.env.PORT || 3000;
const connStr = fwc.connStr;

let db;
MongoClient.connect (connStr, function(err, myDb) {
  if (err) console.log(err);
  db = myDb;
});

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/export', (req, res, next) => {
  const filename = 'Free Write ' + moment().format('M-D-YY h.ma') + '.txt';
  res.setHeader('Content-disposition', 'attachment; filename="' + filename);
  res.setHeader('Content-type', 'text/plain');
  res.send(req.body['user-text']);
})

const router = express.Router();
app.use('/api', router);

router.get('/get-stories', (req, res, next) => {
  getStories(db, res);
});

function getStories(db, res) {
  if (db && db !== "null" && db !== "undefined") {
    // get the stories from the stories collection
    db.collection('stories').find({}, {limit:10, sort:[['_id', 'desc']]}, function(err, cursor) {
      if (err) {
        console.log(err.stack);
      } else {
        cursor.toArray(function(err, items) {
          if (err) {
            console.log(err.stack); 
          } else {
            res.json(items);
          }
        });
      }
    });     
  } else {
    console.log('No mongo found');
  }
}

const server = app.listen(port, function () {
  console.log('Server running at http://127.0.0.1:' + port + '/');
});
