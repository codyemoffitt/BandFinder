const express = require('express');

const songController = require('../controllers/songController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  console.log(req.user);
  res.render('index', { title: 'King Orange', user: req.user });
});

module.exports = router;
