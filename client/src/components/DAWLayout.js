import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Cell, Grid} from "styled-css-grid";

import * as Tone from "tone";

import Sequencer from "./Sequencer";
import Sidebar from "./Sidebar";
import OptionsManager from "./OptionsManager";

import socket from "../socket-connection";

const DAWLayout = props => {
	const {user, loggedOut} = props;
	
	const [projectName, setProjectName] = useState("New Project");
	const [keyCenter, setKeyCenter] = useState("C");
	const [bpm, setBpm] = useState(120);
	const [volume, setVolume] = useState(100);
	const [selectedNote, setSelectedNote] = useState(null);
	const [noteToDelete, setNoteToDelete] = useState(null);
	const [noteAddRequested, setNoteAddRequested] = useState(false);
	const [clearNotesRequested, setClearNotesRequested] = useState(false);
	const [playbackStatus, setPlaybackStatus] = useState("Paused");

	const {id} = useParams();

	useEffect(() => {
		// Handle web sockets
		socket.emit("join", {user: "test-user-1", projectId: id});

		socket.on("connection", message => console.log(message));

		socket.on("noteEdited", ({user, newNote}) => setSelectedNote(newNote));
	}, [id]);

	const handleNoteUpdate = note => {
		setSelectedNote(note);
		const message = {user: "test-user-1", projectId: id, newNote: note};
		socket.emit("noteEdited", message);
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