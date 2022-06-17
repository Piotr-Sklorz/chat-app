var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roomIdSchema = new Schema({
  user1: { type: String, require: true },
  user2: { type: String, require: true }
});

var messageSchema = new Schema({
  roomId: { type: String, require: true },
  sender: { type: String },
  message: { type: String, require: true },
  creationDt: { type: String, require: true }
});

module.exports.RoomId = mongoose.model('RoomId', roomIdSchema);
module.exports.Message = mongoose.model('Message', messageSchema);
