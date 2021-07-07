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
			console.log(project);
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
		// Handle web sockets
		if (user) {
			socket.emit("join", {username: user.name, projectId});

			socket.on("connection", message => console.log(message));

			socket.on("noteEdited", ({newNote}) => setSelectedNote(newNote));
		}
	}, [user, projectId]);

	const handleNoteUpdate = note => {
		setSelectedNote(note);
		
		if (user) {
			const message = {
				username: user.name,
				projectId,
				newNote: note
			};
			socket.emit("noteEdited", message);
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
						projectNameChanged={setProjectName}
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
								keyChanged={setKeyCenter}
								bpm={bpm}
								bpmChanged={setBpm}
								volume={volume}
								volChanged={setVolume}
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
								noteToDelete={noteToDelete}
								noteDeleted={setNoteToDelete}
								doAddNote={noteAddRequested}
								noteAdded={setNoteAddRequested}
								doClearNotes={clearNotesRequested}
								notesCleared={setClearNotesRequested}
							/>
						</Cell>
					</Grid>
				</Cell>
			</Grid>
		</>
	);
};

export default DAWLayout;