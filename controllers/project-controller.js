const Project = require("../models/Project");

const getProjects = async filter => {
	try {
		return await Project.find(filter);
	} catch (err) {
		console.error(err);
	}
};

const getProject = async filter => {
	try {
		return await Project.findOne(filter);
	} catch (err) {
		console.error(err);
	}
};

const addProject = async userId => {
	try {
		const numProjects = await Project.countDocuments({});
		const newProject = new Project({
			name: `New Project ${numProjects + 1}`,
			owner: userId
		});

		return await newProject.save();
	} catch (err) {
		console.error(err);
	}
};

const updateProject = async (userId, projectId, update) => {
	const filter = {_id: projectId, owner: userId};

	try {
		return await Project.findOneAndUpdate(filter, update);
	} catch (err) {
		console.error(err);
	}
};

const deleteProject = async (userId, projectId) => {
	const filter = {_id: projectId, owner: userId};

	try {
		return await Project.findOneAndDelete(filter);
	} catch (err) {
		console.error(err);
	}
};

module.exports = {
	getProjects,
	getProject,
	addProject,
	updateProject,
	deleteProject
};