const express = require("express");

const {ensureAuthenticated} = require("../auth");
const {
	getProjects,
	getProject,
	addProject,
	updateProject,
	deleteProject
} = require("../../controllers/project-controller");

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;

	try {
		const projects = await getProjects({owner: userId});

		res.status(200).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;
	console.log(projectId);

	try {
		const projects = await getProject({_id: projectId, owner: userId});

		res.status(200).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.post("/", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;

	try {
		await addProject(userId);
		const projects = await getProjects({owner: userId});

		res.status(201).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.patch("/:id", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;
	const update = {...req.body};

	try {
		const project = await updateProject(userId, projectId, update);

		res.status(200).json(project);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;

	try {
		await deleteProject(userId, projectId);
		const projects = await getProjects({owner: userId});

		res.status(200).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

module.exports = {router};