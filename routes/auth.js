const Joi = require('joi');
const bcrpyt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

// Login
router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrpyt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
