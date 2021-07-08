import {useCallback, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

import {Cell, Grid} from "styled-css-grid";

import * as Tone from "tone";

import Sequencer from "./Sequencer";
import Sidebar from "./Sidebar";
import OptionsManager from "./OptionsManager";

import socket from "../socket-connection";

const DAWLayout = props => {
	const {user, loggedOut} = props;

	const [projectName, setProjectName] = useState();
	const [initNoteSequence, setInitNoteSequence] = useState();
	const [keyCenter, setKeyCenter] = useState();
	const [bpm, setBpm] = useState();
	const [volume, setVolume] = useState();
	const [selectedNote, setSelectedNote] = useState(null);
	const [noteToDelete, setNoteToDelete] = useState(null);
	const [noteAddRequested, setNoteAddRequested] = useState(false);
	const [clearNotesRequested, setClearNotesRequested] = useState(false);
	const [playbackStatus, setPlaybackStatus] = useState("Paused");

	const history = useHistory();

	const {projectId} = useParams();

	const fetchProject = useCallback(async id => {
		const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
			method: "GET",
			credentials: "include"
		});

		const project = await res.json();
		if (project) {
			setProjectName(project.name);
			setKeyCenter(project.keyCenter);
			setBpm(project.bpm);
			setVolume(project.volume);
			setInitNoteSequence(project.noteSequence);
		} else {
			console.error("Failed to access project");
		}
	}, []);

	useEffect(() => {
		if (projectId) {
			if (user) {
				fetchProject(projectId);
			} else {
				history.push("/");
			}
		}
		
	}, [user, projectId, fetchProject, history]);

	useEffect(() => {
		if (user && projectId) {
			socket.emit("join", {username: user.name, projectId});

			socket.on("connection", message => console.log(message));

			socket.on("noteEdited", ({newNote}) => setSelectedNote(newNote));
		}
	}, [user, projectId]);

	// useEffect(() => {
	// 	if (user && projectId && noteAddRequested) {
	// 		updateNoteSequence(projectId, note);
	// 	}
	// }, [user, projectId, noteAddRequested]);

	const updateProject = async (id, update) => {
		const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
			method: "PATCH",
			credentials: "include",
			body: JSON.stringify({update}),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const project = await res.json();
		if (!project) {
			console.error("Failed to update project");
		}
	};

	const updateNoteSequence = async (id, newNote) => {
		const res = await fetch(`http://localhost:5000/api/projects/${id}/notes`, {
			method: "PATCH",
			credentials: "include",
			body: JSON.stringify({newNote}),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const project = await res.json();
		if (!project) {
			console.error("Failed to update note sequence");
		}
	};

	const handleNoteUpdate = note => {
		setSelectedNote(note);
		
		if (user && projectId) {
			const message = {
				username: user.name,
				projectId,
				newNote: note
			};
			socket.emit("noteEdited", message);

			updateNoteSequence(projectId, note);
		}
	};

	const handleNoteAdd = note => {

	};

	const handleNoteDelete = note => {

	};

	const clearNoteSequence = () => {
		if (user && projectId) {
			const message = {
				username: user.name,
				projectId
			};

			socket.emit("notesCleared", message);
			updateProject(projectId, {noteSequence: []});
		}
	};

	const updateProjectName = newProjectName => {
		setProjectName(newProjectName);

		if (user && projectId) {
			updateProject(projectId, {name: newProjectName});
		}
	};

	const updateKeyCenter = newKeyCenter => {
		setKeyCenter(newKeyCenter);

		if (user && projectId) {
			updateProject(projectId, {keyCenter: newKeyCenter});
		}
	};

	const updateBpm = newBpm => {
		setBpm(newBpm);

		if (user && projectId) {
			updateProject(projectId, {bpm: newBpm});
		}
	};

	const updateVolume = newVolume => {
		setVolume(newVolume);
		
		if (user && projectId) {
			updateProject(projectId, {volume: newVolume});
		}
	};

	const updatePlayback = async () => {
		if (playbackStatus === "Paused") {
			await Tone.start();
			setPlaybackStatus("Playing");
		} else if (playbackStatus === "Playing") {
			setPlaybackStatus("Paused");
		}
	};

	const getPlaybackButtonText = () => {
		let text = "Play";

		if (playbackStatus === "Playing") {
			text = "Pause";
		}

		return text;
	};

	return (
		<>
			<h1 className="center-text">Relatable DAW</h1>
			<Grid columns={4} gap="1rem">
				<Cell width={1}>
					<Sidebar
						projectName={projectName}
						projectNameChanged={updateProjectName}
						selectedNote={selectedNote}
						noteUpdated={handleNoteUpdate}
						deleteRequested={setNoteToDelete}
						addRequested={setNoteAddRequested}
						clearRequested={setClearNotesRequested}
					/>
				</Cell>
				<Cell width={3}>
					<Grid rows={"1rem 1fr"} columns={1} justifyContent="start" alignContent="start" gap={"1rem"}>
						<Cell>
							<OptionsManager
								keyCenter={keyCenter}
								keyChanged={updateKeyCenter}
								bpm={bpm}
								bpmChanged={updateBpm}
								volume={volume}
								volChanged={updateVolume}
								updatePlayback={updatePlayback}
								playbackButtonText={getPlaybackButtonText()}
							/>
						</Cell>
						<Cell>
							<Sequencer
								initNoteSequence={initNoteSequence}
								selectedNote={selectedNote}
								playbackStatus={playbackStatus}
								keyCenter={keyCenter}
								bpm={bpm}
								volume={volume}
								noteSelected={setSelectedNote}
								noteUpdated={handleNoteUpdate}
								noteToDelete={noteToDelete}
								noteDeleted={setNoteToDelete}
								doAddNote={noteAddRequested}
								noteAdded={setNoteAddRequested}
								doClearNotes={clearNotesRequested}
								notesCleared={setClearNotesRequested}
								handleClearNotes={clearNoteSequence}
							/>
						</Cell>
					</Grid>
				</Cell>
			</Grid>
		</>
	);
};

export default DAWLayout;