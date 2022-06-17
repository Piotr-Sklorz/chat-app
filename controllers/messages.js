const { RoomId, Message } = require('../models/message');

exports.getRoomID = async (req, res, next) => {
  try {
    var roomID = await RoomId.findOne({
      $or: [{ $and: [{ user1: req.user.email }, { user2: req.params.email }] },
            { $and: [{ user1: req.params.email }, { user2: req.user.email }] }]
    }).exec();
    if (roomID) {
      roomID = await RoomId.findOne({
        $or: [{ $and: [{ user1: req.user.email }, { user2: req.params.email }] },
              { $and: [{ user1: req.params.email }, { user2: req.user.email }] }]
      }, { _id: 1 });
      res.cookie('selectedUser', roomID._id, { maxAge: 900000, httpOnly: true });
      return res.status(200).json(roomID);
    } else {
      var roomId = new RoomId({
        user1: req.user.email,
        user2: req.params.email
      });
      doc = await roomId.save();
      res.cookie('selectedUser', roomID._id, { maxAge: 900000, httpOnly: true });
      return res.status(200).json(doc);
    }
  } catch (err) {
    return res.status(501).json(err);
  }
}

exports.pushMessageToRoom = async (req, res, next) => {
  var newMessage = new Message({
    roomId: req.body.roomId,
    sender: req.body.sender,
    message: req.body.message,
    creationDt: Date.now()
  });
  try {
    doc = await newMessage.save();
    return res.status(201).json('Message was saved in db.');
  } catch (err) {
      return res.status(501).json(err);
  }
}

exports.getMessages = async (req, res, next) => {
  try {
    var messages = await Message.find({ roomId: req.body.roomId }, {})
      .sort({ creationDt: 1 })
      .exec();
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(501).json(err);
  }
}
