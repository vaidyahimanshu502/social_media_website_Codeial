const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsController = require('../controllers/friends_controller');

router.get('/add-friend', friendsController.addFriends);


module.exports = router;