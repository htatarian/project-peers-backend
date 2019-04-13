const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth.js');
const bcrpyt = require('bcrypt');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) =>{
    const token = req.header('x-auth-token');
    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    const user = await User.findById(decode._id).select('-password');

    return res.send(user);
    // return res.send(decode._id);
});

// Create user
router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['firstname', 'lastname', 'email', 'password']));
    const salt = await bcrpyt.genSalt(10);
    user.password = await bcrpyt.hash(user.password,salt);

    await user.save();

    res.send(_.pick(user, ['firstname', 'lastname', 'email']));
});

module.exports = router;
