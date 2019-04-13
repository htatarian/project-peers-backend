const auth = require('../middleware/auth.js');
const {Project, validate} = require('../models/project');
const express = require('express');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    const projects = await Project.find();
    res.send(projects);
});

// Get project given id
router.get('/:id', async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

// Add a project
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let project = new Project({
        title: req.body.title,
        description: req.body.description,
    });

    project = await project.save();

    res.send(project);
});

// Remove a project
router.delete('/:id', auth, async (req, res) => {
    const project = await Project.findByIdAndRemove(req.params.id);

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

module.exports = router;
