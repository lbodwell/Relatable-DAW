const Project = require("../models/Project");
const {getUser, getUsersByIds} = require("./user-controller");

const getProjects = async filter => {
	try {
		return await Project.find(filter).sort({lastEdited: -1});
	} catch (err) {
		console.error(err);
		return null;
	}
};

const getProject = async filter => {
	try {
		return await Project.findOne(filter);
	} catch (err) {
		console.error(err);
		return null;
	}
};

const getCollaborators = async filter => {
	try {
		let collaborators = [];

		const project = await getProject(filter);
		
		if (project) {
			const editorIds = project.editors;
			if (editorIds && editorIds.length !== 0) {
				const editors = await getUsersByIds(editorIds);
				editors.forEach(editor => collaborators.push({...editor._doc}));
			}
		}

		return collaborators;
	} catch (err) {
		console.error(err);
		return null;
	}
};

const addProject = async (filter, userId) => {
	try {
		const numProjects = await Project.countDocuments(filter);
		const newProject = new Project({
			name: `New Project ${numProjects + 1}`,
			owner: userId
		});

		await newProject.save();

		return await getProjects(filter);
	} catch (err) {
		console.error(err);
		return null;
	}
};

const addCollaborator = async (filter, email) => {
	try {
		const project = await getProject(filter);
		const {editors} = project;

		const user = await getUser({email});
		if (!user) {
			return null;
		}
		const userId = user._id;

		if (!editors.some(editor => editor._id === userId)) {
			editors.push(userId);
			await updateProject(filter, {editors});
		}

		return await getCollaborators(filter);
	} catch (err) {
		console.error(err);
		return null;
	}
};

const updateProject = async (filter, update) => {
	try {
		return await Project.findOneAndUpdate(filter, {...update, lastEdited: Date.now()});
	} catch (err) {
		console.error(err);
		return null;
	}
};

const updateNoteSequence = async (filter, newNote) => {
	const noteId = newNote.id;
	
	try {
		const project = await getProject(filter);

		let newNoteSequence = [...project.noteSequence];
		newNoteSequence[noteId] = newNote;
		const update = {noteSequence: newNoteSequence, lastEdited: Date.now()};

		return await Project.findOneAndUpdate(filter, update);
	} catch (err) {
		console.error(err);
		return null;
	}
};

const deleteProject = async (filter, deletionFilter) => {
	try {
		await Project.findOneAndDelete(deletionFilter);

		return await getProjects(filter);
	} catch (err) {
		console.error(err);
		return null;
	}
};

const deleteCollaborator = async (filter, deletionFilter, editorId) => {
	try {
		const project = await Project.findOne(deletionFilter);
		const {editors} = project;

		const newEditors = editors.filter(editor => editor != editorId);
		await updateProject(deletionFilter, {editors: newEditors});

		return await getCollaborators(filter);
	} catch (err) {
		console.error(err);
	}
};

module.exports = {
	getProjects,
	getProject,
	getCollaborators,
	addProject,
	addCollaborator,
	updateProject,
	updateNoteSequence,
	deleteProject,
	deleteCollaborator
};