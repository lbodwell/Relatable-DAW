const express = require("express");

const Project = require("../models/Project");
const {ensureAuthenticated} = require("./auth");

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
	const userId = req.session.userId;

	try {
		const projects = await Project.find({owner: userId});

		// Send result
		res.status(200).json(projects);
	} catch (err) {
		// Report errors
		res.status(500).json({success: false, error: err});
	}
});

router.get("/:id", ensureAuthenticated, async (req, res) => {

});

module.exports = {router};