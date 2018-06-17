const express = require('express');
const passport = require('passport');
const songController = require('../controllers/songController');
const router = express.Router();

// GET request for list of all Songs.
router.get('/', songController.song_list);

// GET request for creating a Song. NOTE This must come before routes that display Book (uses id).
router.get('/song/create', songController.song_create_get);

// POST request for creating Song.
router.post('/song/create', songController.song_create_post);

// GET request for one Song.
router.get('/song/:id', songController.song_detail);

// GET request to delete Song.
router.get('/song/:id/delete', songController.song_delete_get);

// POST request to delete Song.
router.post('/song/:id/delete', songController.song_delete_post);

// GET request to upvote Song.
router.get('/song/:id/upvote', checkAuthentication, songController.song_upvote_get);

// POST request to upvote Song.
router.post('/song/:id/upvote', checkAuthentication, songController.song_upvote_post);

// GET request to downvote Song.
router.get('/song/:id/downvote', checkAuthentication, songController.song_downvote_get);

// POST request to downvote Song.
router.post('/song/:id/downvote', checkAuthentication, songController.song_downvote_post);

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.redirect('/auth/google');
  }
}

module.exports = router;
