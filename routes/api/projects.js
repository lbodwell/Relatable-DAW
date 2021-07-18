const express = require("express");

const {ensureAuthenticated} = require("../auth");
const {
	getProjects,
	getProject,
	getCollaborators,
	addProject,
	addCollaborator,
	updateProject,
	updateNoteSequence,
	deleteProject,
	deleteCollaborator
} = require("../../controllers/project-controller");

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const filter = {
		$or: [
			{owner: userId},
			{editors: userId}
		]
	};

	try {
		const projects = await getProjects(filter);

		res.status(200).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;
	const filter = {
		$and: [
			{_id: projectId}, 
			{
				$or: [
					{owner: userId},
					{editors: userId}
				]
			}
		]
	};

	try {
		const projects = await getProject(filter);

		res.status(200).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.get("/:id/collaborators", ensureAuthenticated, async (req, res) => {
	const projectId = req.params.id;
	const userId = req.user._id;
	const filter = {
		$and: [
			{_id: projectId}, 
			{
				$or: [
					{owner: userId},
					{editors: userId}
				]
			}
		]
	};

	try {
		const collaborators = await getCollaborators(filter);

		res.status(200).json(collaborators);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.post("/", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const filter = {
		$or: [
			{owner: userId},
			{editors: userId}
		]
	};

	try {
		const projects = await addProject(filter, userId);

		res.status(201).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.post("/:id/collaborators", ensureAuthenticated, async (req, res) => {
	const projectId = req.params.id;
	const userId = req.user._id;
	const {email} = req.body;
	const filter = {_id: projectId, owner: userId};

	try {
		const collaborators = await addCollaborator(filter, email);

		if (collaborators) {
			res.status(201).json(collaborators);
		} else {
			res.status(404).json(null);
		}
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.patch("/:id", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;
	const {update} = req.body;
	const filter = {
		$and: [
			{_id: projectId}, 
			{
				$or: [
					{owner: userId},
					{editors: userId}
				]
			}
		]
	};

	try {
		const project = await updateProject(filter, update);

		res.status(200).json(project);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.patch("/:id/notes", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;
	const {newNote} = req.body;
	const filter = {
		$and: [
			{_id: projectId}, 
			{
				$or: [
					{owner: userId},
					{editors: userId}
				]
			}
		]
	};

	try {
		const project = await updateNoteSequence(filter, newNote);

		res.status(200).json(project);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;

	const filter = {
		$or: [
			{owner: userId},
			{editors: userId}
		]
	};
	const deletionFilter = {
		_id: projectId,
		owner: userId
	};

	try {
		const projects = await deleteProject(filter, deletionFilter);

		res.status(200).json(projects);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.delete("/:id/collaborators", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;
	const projectId = req.params.id;
	const {editorId} = req.body;

	const filter = {
		$and: [
			{_id: projectId}, 
			{
				$or: [
					{owner: userId},
					{editors: userId}
				]
			}
		]
	};
	const deletionFilter = {
		_id: projectId,
		owner: userId
	};

	try {
		const collaborators = await deleteCollaborator(filter, deletionFilter, editorId);

		res.status(200).json(collaborators);
	} catch (err) {
		console.error(err);
		res.status(500);	
	}
});

module.exports = {router};