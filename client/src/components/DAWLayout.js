import {useState} from "react";
import {Grid, Cell} from "styled-css-grid";
import * as Tone from "tone";

import Sequencer from "./Sequencer";
import KeyManager from "./KeyManager";
import Sidebar from "./Sidebar";

const DAWLayout = () => {
	const [keyCenter, setKeyCenter] = useState("C");
	const [selectedNote, setSelectedNote] = useState(null);
	const [playbackStatus, setPlaybackStatus] = useState("Paused");

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
			<KeyManager keyCenter={keyCenter} keyChanged={setKeyCenter}/>
			<button onClick={updatePlayback}>{getPlaybackButtonText()}</button>
			<Grid columns={4} gap="1rem">
				<Cell width={1}>
					<Sidebar keyCenter={keyCenter} selectedNote={selectedNote}/>
				</Cell>
				<Cell width={3}>
					<Sequencer playbackStatus={playbackStatus} keyCenter={keyCenter} selectedNote={selectedNote} noteSelected={setSelectedNote}/>
				</Cell>
			</Grid>	
		</div>
	);
};

export default DAWLayout;