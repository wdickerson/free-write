'use strict';
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const fwc = require('./free-write-config');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
app.use(express.static('client/dist/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/export', (req, res, next) => {
  res.attachment('Free Write ' + moment().format('M-D-YY h.ma') + '.txt');
  res.send(req.body['user-text']);
});

app.get('/get-stories', (req, res) => {  
  MongoClient.connect(fwc.connStr, (err, db) => {
    if (err) return res.send('db error');
    db.collection('stories').find({}, {limit:10, sort:[['_id', 'desc']]}, (err, cursor) => {
      if (err) return res.send('nested db error');
      cursor.toArray((err, items) => res.json(items));
    });   
  });
});

// Wip. Need to keep users in a mongo collection
const users = [];

const fbConfig = {
  clientID: fwc.fbAppId,
  clientSecret: fwc.fbAppSecret,
  callbackURL: 'facebook-callback'
};

const fbStrategy = new FacebookStrategy(fbConfig, (access, refresh, profile, cb) => {
  const myFbUser = users.find(u => u.fbid === profile.id); // Should query mongo
  if (myFbUser) return cb(null, myFbUser);
  const newFbUser = {
    username: profile.displayName,
    fbid: 1,
    isUser: true,
  }
  users.push(newFbUser); // Should insert to mongo
  return cb(null, newFbUser);
});

passport.serializeUser((user, cb) => cb(null, user.username));
passport.deserializeUser((username, cb) => cb(null, users.find(u => u.username === username)));
passport.use(fbStrategy);

app.use(session({ secret: fwc.sessionSecret }));
app.use(passport.initialize());  
app.use(passport.session());

app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/login/facebook-callback', passport.authenticate('facebook', { 
  successRedirect: '/', 
  failureRedirect: '/fail' 
}));

app.get('/fail', (req, res) => res.send('unknown user'));
app.get('/logout', (req, res) => req.logout() || res.redirect('/'));
app.get('/authenticate', (req, res) => {
  if (req.isAuthenticated()) return res.json({ isUser: true, name: req.user.username });
  return res.json({ isUser: false, name: null });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log('Running @ http://127.0.0.1:' + port));
