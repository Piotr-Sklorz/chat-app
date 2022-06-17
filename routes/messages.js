var express = require('express');
var messagesController = require('../controllers/messages');

var router = express.Router();

router.get('/:email', messagesController.getRoomID);
router.post('/', messagesController.pushMessageToRoom);
router.post('/getAllByRoomId', messagesController.getMessages);

module.exports = router;
