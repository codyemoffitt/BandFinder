const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET request for list of all Users.
router.get('/', userController.user_list);
router.get('/users/:instrument/:zipcode', userController.user_list);

module.exports = router;
