#! /usr/bin/env node

var async = require('async');

var User = require('./models/user');
var Song = require('./models/song');

var mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Users = [];
var Songs = [];

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

function SongCreate(name, artist, link, cb) {
  Songdetail = { name: name, artist: artist, link: link };

  var song = new Song(Songdetail);

  song.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('Song User: ' + song);
    Songs.push(song);
    cb(null, song);
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

function createSongs(cb) {
  async.parallel(
    [
      function(callback) {
        SongCreate('Use Me', 'Bill Withers', 'http://www.google.com', callback);
      },
      function(callback) {
        SongCreate('Whats Going On', 'Marvin Gaye', 'http://www.google.com', callback);
      },
      function(callback) {
        SongCreate('Hair of the Dog', 'Nazareth', 'http://www.google.com', callback);
      }
    ],
    // optional callback
    cb
  );
}

// async.series(
//   [createUsers],
//   // Optional callback
//   function(err, results) {
//     if (err) {
//       console.log('FINAL ERR: ' + err);
//     } else {
//     }
//     // All done, disconnect from database
//     mongoose.connection.close();
//   }
// );

async.series(
  [createSongs],
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
