'use strict';
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const fwc = require('./free-write-config');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(express.static('client/dist/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/export', (req, res, next) => {
  res.attachment(req.body.title + '.txt');
  res.send(req.body.text);
});

app.get('/get-universal-stories', (req, res) => {  
  // placeholder
});

const fbConfig = {
  clientID: fwc.fbAppId,
  clientSecret: fwc.fbAppSecret,
  callbackURL: 'facebook-callback'
};

const fbStrategy = new FacebookStrategy(fbConfig, (access, refresh, profile, cb) => {  
  MongoClient.connect(fwc.connStr, (err, db) => {
    db.collection('users').update({ id: profile.id }, profile, { upsert: true });   
  });
  return cb(null, profile);
});

// deserialize user could also query the database, if desired
passport.serializeUser((user, cb) => cb(null, { id: user.id, displayName: user.displayName }));
passport.deserializeUser((input, cb) => cb(null, input));

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
  if (req.isAuthenticated()) {
    return res.json({ 
      isUser: true, 
      name: req.user.displayName.split(' ')[0]
    });
  }
  return res.json({ isUser: false, name: null });
});

app.get('/get-user-stories', (req, res) => {
  if (!req.isAuthenticated()) return res.json([]);
  MongoClient.connect(fwc.connStr, (err, db) => {
    db.collection('stories').find({ userId: req.user.id }, { fields: {userId: 0}, sort: {title: 1}}, (err, cursor) => {
      cursor.toArray((err, items) => res.json(items));
    });   
  });
});

app.post('/save-story', (req, res, next) => {
  if (!req.isAuthenticated()) return res.json(null);
  if (req.body.title === '') return res.send(null);
  const query = {
    _id: ObjectId(req.body._id),
    userId: req.user.id
  }
  
  const story = {
    title: req.body.title,
    text: req.body.text,
    userId: req.user.id
  }
  
  MongoClient.connect(fwc.connStr, (err, db) => {
    db.collection('stories').findAndModify(query, null, story, { new: true, upsert: true }, (err, item) => res.send(item.value._id));   
  });
});

app.post('/delete-story', (req, res, next) => {
  if (!req.isAuthenticated()) return res.json(null);
  MongoClient.connect(fwc.connStr, (err, db) => {
    db.collection('stories').deleteOne({ 
      _id: ObjectId(req.body._id), 
      userId: req.user.id 
    }, () => res.sendStatus(200));   
  }); 
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log('Running @ http://127.0.0.1:' + port));
