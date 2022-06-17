var express = require('express');
var usersController = require('../controllers/users');

var router = express.Router();

router.post('/register',
  usersController.checkIfTheEmailIsAlreadyTaken,
  usersController.checkIfTheUsernameIsAlreadyTaken,
  usersController.register);
router.post('/login', usersController.login);
router.get('', usersController.getUsers);
router.get('/current', usersController.isValidUser, usersController.current);
router.delete('/logout', usersController.isValidUser, usersController.logout);
router.patch('/friends/add', usersController.addToFriends);
router.patch('/invitations/add', usersController.addToInvitations);
router.patch('/friends/remove', usersController.removeFromFriends);
router.patch('/invitations/remove', usersController.removeFromInvitations);
router.get('/friends', usersController.getFriends);
router.get('/invitations', usersController.getInvitations);
router.get('/isUserAuthenticated', usersController.isUserAuthenticated);

module.exports = router;
