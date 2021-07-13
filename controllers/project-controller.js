const Project = require("../models/Project");
const {getUsersByIds} = require("./user-controller");

const getProjects = async filter => {
	try {
		return await Project.find(filter).sort({lastEdited: -1});
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

const getCollaborators = async filter => {
	try {
		let collaborators = [];

		const project = await getProject(filter);
		const editorIds = project.editors;
		const viewerIds = project.viewers;

		if (editorIds && editorIds.length !== 0) {
			const editors = await getUsersByIds(editorIds);
			editors.forEach(editor => {
				collaborators.push({...editor._doc, role: "editor"});
			});
		}

		if (viewerIds && viewerIds.length !== 0) {
			const viewers = await getUsersByIds(viewerIds);
			viewers.forEach(viewer => {
				collaborators.push({...viewer._doc, role: "viewer"});
			});
		}

		return collaborators;
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

// TODO: move filter definition to route
const updateProject = async (userId, projectId, update) => {
	const filter = {
		$and: [
			{_id: projectId}, 
			{
				$or: [
					{owner: userId},
					{editors: userId},
					{viewers: userId}
				]
			}
		]
	};

	try {
		return await Project.findOneAndUpdate(filter, {...update, lastEdited: Date.now()});
	} catch (err) {
		console.error(err);
	}
};

// TODO: move filter definition to route
const updateNoteSequence = async (userId, projectId, newNote) => {
	const noteId = newNote.id;
	const filter = {
		$and: [
			{_id: projectId}, 
			{
				$or: [
					{owner: userId},
					{editors: userId},
					{viewers: userId}
				]
			}
		]
	};
	
	try {
		const project = await getProject(filter);
		let newNoteSequence = [...project.noteSequence];
		newNoteSequence[noteId] = newNote;
		const update = {noteSequence: newNoteSequence, lastEdited: Date.now()};

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
	getCollaborators,
	addProject,
	updateProject,
	updateNoteSequence,
	deleteProject
};