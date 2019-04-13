const _ = require('lodash');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const schema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },
    active: {
        type: Boolean,
        default: false
    }
});
schema.methods.generateAuthToken = function() {
    return jwt.sign(
        {
            _id: this._id
        }
        , config.get('jwtPrivateKey'));
};

// User model
const User = mongoose.model('User', schema);






// Validates the User object
function validate(user) {
    const schema = {
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;

