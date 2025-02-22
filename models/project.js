const Joi = require('joi');
const mongoose = require('mongoose');

// Project model
const Project = mongoose.model('Project', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}));

// Validates the Project object
function validate(project) {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string().required(),
        date: null
    };

    return Joi.validate(project, schema);
}

exports.Project = Project;
exports.validate = validate;

