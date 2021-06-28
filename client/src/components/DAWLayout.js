import {useState, useEffect} from "react";
import {Grid, Cell} from "styled-css-grid";
import * as Tone from "tone";
import socket from "../socket-connection";

import Sequencer from "./Sequencer";
import OptionsManager from "./OptionsManager";
import NoteEditor from "./NoteEditor";

const DAWLayout = () => {
	const [keyCenter, setKeyCenter] = useState("C");
	const [bpm, setBpm] = useState(120);
	const [selectedNote, setSelectedNote] = useState(null);
	const [noteToDelete, setNoteToDelete] = useState(null);
	const [noteAddRequested, setNoteAddRequested] = useState(false);
	const [clearNotesRequested, setClearNotesRequested] = useState(false);
	const [playbackStatus, setPlaybackStatus] = useState("Paused");

	useEffect(() => {
		socket.on("connection", message => {
			console.log(message);
		});
		socket.on("disconnection", message => {
			console.log(message);
		});
		socket.on("noteEdited", message => {
			const {user, newNote} = message;

			console.log(`${user} edited a note`);
			console.log(newNote);
			// TODO: update note sequence
		});
	}, []);

	const handleNoteUpdate = note => {
		setSelectedNote(note);
		const message = {user: "test-user-1", projectId: 0, newNote: note};
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
		<div className="App">
			<h1>Relatable DAW</h1>
			<OptionsManager keyCenter={keyCenter} keyChanged={setKeyCenter} bpm={bpm} bpmChanged={setBpm}/>
			<button onClick={updatePlayback}>{getPlaybackButtonText()}</button>
			<Grid columns={4} gap="1rem">
				<Cell width={1}>
					<NoteEditor
						selectedNote={selectedNote}
						noteUpdated={handleNoteUpdate}
						deleteRequested={setNoteToDelete}
						addRequested={setNoteAddRequested}
						clearRequested={setClearNotesRequested}
					/>
				</Cell>
				<Cell width={3}>
					<Sequencer
						selectedNote={selectedNote}
						playbackStatus={playbackStatus}
						keyCenter={keyCenter}
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
		</div>
	);
};

export default DAWLayout;