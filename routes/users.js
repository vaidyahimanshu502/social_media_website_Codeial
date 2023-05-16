const express = require('express');
const router = express.Router();
const passport = require('passport')
const userController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);
//before rendering friends
// router.get('/profile', passport.checkAuthentication, userController.profile);
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);
router.post('/create', userController.create);
// router.post('/create-session', userController.createSession);
router.post('/create-session', 
  passport.authenticate('local', { failureRedirect: '/users/sign-in' }),
  function(req, res) {
    res.redirect('/');
  }, userController.createSession);

router.get('/sign-out', userController.destroySession);
router.post('/update/:id', userController.update);

//routes for google sign in
router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
  'google',
  {failureRedirect : '/users/sign-in'}
), userController.createSession);

router.get('/reset-password', userController.resetPassword);
router.post('/send-reset-pass-mail', userController.resetPassMail);
router.get('/reset-password/:accessToken', userController.setPassword);
router.post('/update-password/:accessToken', userController.updatePassword);

module.exports = router;