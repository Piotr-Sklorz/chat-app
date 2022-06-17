var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var schema = new Schema({
    email: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true },
    friends: { type: [{ email: String, firstName: String, lastName: String, username: String }] },
    invitations: { type: [{ email: String, firstName: String, lastName: String, username: String, isMyRequest: Boolean }] },
    creationDt: { type: String, require: true }
});

var imageSchema = new mongoose.Schema({
    name: { type: String, require: true },
    desc: { type: String, require: true },
    img:
    {
        data: { type: Buffer, require: true },
        contentType: { type: String, require: true }
    }
});

schema.statics.hashPassword = function hashPassword(pass) {
    return bcrypt.hashSync(pass, 10);
}

schema.methods.verifyPassword = function(hashedpassword) {
    return bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User', schema);
