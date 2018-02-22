const express = require('express');
const user_controller = require('../controllers/userController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// GET request for list of all Users.
router.get('/users', user_controller.user_list);
router.get('/users/:instrument/:zipcode', user_controller.user_list);

module.exports = router;
