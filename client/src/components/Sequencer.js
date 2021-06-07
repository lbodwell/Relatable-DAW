import {useState, useEffect} from "react";
import {Grid, Cell} from "styled-css-grid";
import Note from "./Note";
import {getPitches} from "../PitchHandler";

const Sequencer = () => {
	const [noteSequence, setNoteSequence] = useState([
		{id: 0, color: "blue", relation: {parent: -1, interval: "1P"}},
		{id: 1, color: "green", relation: {parent: 0, interval: "3M"}},
		{id: 2, color: "red", relation: {parent: 1, interval: "-2M"}},
		{id: 3, color: "yellow", relation: {parent: -1, interval: "P5"}},
		{id: 4, color: "orange", relation: {parent: 0, interval: "P8"}}
	]);

	const [pitches, setPitches] = useState([]);

	useEffect(() => {
		// TODO: get key dynamically
		setPitches(getPitches(noteSequence, "C"));
	}, [noteSequence]);

	return (
		<Grid columns={12} gap="1px">
			{noteSequence.map(note => (
				<Cell key={note.id} width={1} height={1}>
					<Note id={note.id} color={note.color} relation={note.relation} pitch={pitches[note.id]}/>
				</Cell>
			))}
		</Grid>
	)
};

export default Sequencer;