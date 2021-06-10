import {useState} from "react";

import {Grid, Cell} from "styled-css-grid";

import Sequencer from "./Sequencer";
import KeyManager from "./KeyManager";
import Sidebar from "./Sidebar";

const DAWLayout = () => {
	const [keyCenter, setKeyCenter] = useState("C");
	const [selectedNote, setSelectedNote] = useState(null);

	const playMusic = evt => {
		if (evt.target.innerHTML === "Play") {
			evt.target.innerHTML = "Pause";
			console.log("playing music");
		} else if (evt.target.innerHTML === "Pause") {
			evt.target.innerHTML = "Play";
			console.log("pausing music");
		}
		// TODO
	};

	return (
		<div className="App">
			<h1>Relatable DAW</h1>
			<KeyManager keyCenter={keyCenter} keyChanged={setKeyCenter}/>
			<button onClick={playMusic}>Play</button>
			<Grid columns={2} gap="1px">
				<Cell>
					<Sidebar keyCenter={keyCenter} selectedNote={selectedNote}/>
				</Cell>
				<Cell>
					<Sequencer keyCenter={keyCenter} selectedNote={selectedNote} noteSelected={setSelectedNote}/>
				</Cell>
			</Grid>	
		</div>
	);
};

export default DAWLayout;