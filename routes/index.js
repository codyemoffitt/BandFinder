const express = require('express');
const userController = require('../controllers/userController');
const songController = require('../controllers/songController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// GET request for list of all Users.
router.get('/users', userController.user_list);
router.get('/users/:instrument/:zipcode', userController.user_list);

// GET request for list of all Songs.
router.get('/songs', songController.song_list);

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
router.get('/song/:id/upvote', songController.song_upvote_get);

// POST request to upvote Song.
router.post('/song/:id/upvote', songController.song_upvote_post);

// GET request to downvote Song.
router.get('/song/:id/downvote', songController.song_downvote_get);

// POST request to downvote Song.
router.post('/song/:id/downvote', songController.song_downvote_post);

module.exports = router;
