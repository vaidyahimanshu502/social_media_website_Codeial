const express = require('express');
const router = express.Router();

//to access home page
router.use('/', require('./home'))

// //to access the users page
router.use('/users', require('./users'));

// //to access the post page
router.use('/posts', require('./post'));

//to create comments
router.use('/comments', require('./comments'));

//to use api\v1 files
router.use('/api', require('./api'));

//for likes
router.use('/likes', require('./likes'));

//for friend_controller
router.use('/friends', require('./friends'));

module.exports=router;