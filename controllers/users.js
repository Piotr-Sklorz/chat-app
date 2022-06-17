var User = require('../models/user');
var passport = require('passport');

exports.register = async (req, res) => {
    var user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: User.hashPassword(req.body.password),
        friends: [{
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username}],
        invitations: [],
        creationDt: Date.now()
    });
    try {
        doc = await user.save();
        return res.status(201).json('Account was created.');
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.login = (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) { return res.status(501).json(err); }
        if (!user) { return res.status(info.status).json(info.message); }
        req.logIn(user, (err) => {
            if (err) { return res.status(501).json(err); }
            return res.status(200).json('Login Success.');
        });
    })(req, res, next);
}

exports.getUsers = async (req, res, next) => {
    try {
        var users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.current = (req, res) => {
    return res.status(200).json(req.user);
}

exports.logout = (req, res) => {
    req.logout();
    return res.status(200).json('Logout Success.');
}

exports.addToFriends = async (req, res, next) => {
    try {
        await User.updateOne({ email: req.body.currentUserEmail }, { $push: { friends: {
            email: req.body.addingUserEmail,
            firstName: req.body.addingUserFirstName,
            lastName: req.body.addingUserLastName,
            username: req.body.addingUserUsername
        }}});
        await User.updateOne({ email: req.body.addingUserEmail }, { $push: { friends: {
            email: req.body.currentUserEmail,
            firstName: req.body.currentUserFirstName,
            lastName: req.body.currentUserLastName,
            username: req.body.currentUserUsername
        }}});
        return res.status(200).json('User was add to friends.');
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.addToInvitations = async (req, res, next) => {
    try {
        await User.updateOne({ email: req.body.currentUserEmail }, { $push: { invitations: {
            email: req.body.addingUserEmail,
            firstName: req.body.addingUserFirstName,
            lastName: req.body.addingUserLastName,
            username: req.body.addingUserUsername,
            isMyRequest: true
        }}});
        await User.updateOne({ email: req.body.addingUserEmail }, { $push: { invitations: {
            email: req.body.currentUserEmail,
            firstName: req.body.currentUserFirstName,
            lastName: req.body.currentUserLastName,
            username: req.body.currentUserUsername,
            isMyRequest: false
        }}});
        return res.status(200).json('Invitation was send.');
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.removeFromFriends = async (req, res, next) => {
    try {
        await User.updateOne({ email: req.body.currentUserEmail },
            { $pull: { friends: { email: req.body.removingUserEmail }}});
        await User.updateOne({ email: req.body.removingUserEmail },
            { $pull: { friends: { email: req.body.currentUserEmail }}});
        return res.status(200).json('Invitation was removed.');
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.removeFromInvitations = async (req, res, next) => {
    try {
        await User.updateOne({ email: req.body.currentUserEmail },
            { $pull: { invitations: { email: req.body.removingUserEmail }}});
        await User.updateOne({ email: req.body.removingUserEmail },
            { $pull: { invitations: { email: req.body.currentUserEmail }}});
        return res.status(200).json('Invitation was removed.');
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.getFriends = async (req, res, next) => {
    try {
        var friends = await User.findOne({ email: req.user.email }, { friends: 1, _id: 0 });
        return res.status(200).json(friends);
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.getInvitations = async (req, res, next) => {
    try {
        var invitations = await User.findOne({ email: req.user.email }, { invitations: 1, _id: 0 });
        return res.status(200).json(invitations);
    } catch (err) {
        return res.status(501).json(err);
    }
}

exports.isUserAuthenticated = (req, res, next) => {
    if (req.user) {
        return res.status(200).json({ isAuthenticated: true });
    }
    return res.status(200).json({ isAuthenticated: false });
}

exports.isValidUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.status(401).json('Unauthorized Request.');
    }
}

exports.checkIfTheEmailIsAlreadyTaken = async (req, res, next) => {
    try {
        if (await User.exists({ email: req.body.email })) {
            return res.status(409).json('Email is already exist.');
        }
    } catch (err) {
        return res.status(501).json(err);
    }
    next();
}

exports.checkIfTheUsernameIsAlreadyTaken = async (req, res, next) => {
    try {
        if (await User.exists({ username: req.body.username })) {
            return res.status(409).json('Username is already exist.');
        }
    } catch (err) {
        return res.status(501).json(err);
    }
    next();
}
