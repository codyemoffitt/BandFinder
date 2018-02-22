#! /usr/bin/env node

console.log(
  'This script populates some Users to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url'
);

var async = require('async');

var User = require('./models/user');

var mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Users = [];

function UserCreate(first_name, family_name, d_birth, zipcode, instrument, cb) {
  Userdetail = { first_name: first_name, family_name: family_name };
  if (d_birth != false) Userdetail.date_of_birth = d_birth;
  Userdetail.zipcode = zipcode;
  Userdetail.instrument = instrument;

  var user = new User(Userdetail);

  user.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    Users.push(user);
    cb(null, user);
  });
}

function createUsers(cb) {
  async.parallel(
    [
      function(callback) {
        UserCreate('Tommy', 'Rothfuss', '1973-06-06', 48820, 'Guitar', callback);
      },
      function(callback) {
        UserCreate('Ben', 'Bova', '1932-11-8', 48820, 'Guitar', callback);
      },
      function(callback) {
        UserCreate('Isaac', 'Asimov', '1920-01-02', 48820, 'Guitar', callback);
      }
    ],
    // optional callback
    cb
  );
}

async.series(
  [createUsers],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
