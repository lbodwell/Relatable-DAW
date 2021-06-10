import {useState, useEffect, useCallback} from "react";
import {Grid, Cell} from "styled-css-grid";
import {transpose} from "@tonaljs/core";

import Note from "./Note";

const Sequencer = props => {
	const [noteSequence, setNoteSequence] = useState([
		{id: 0, color: "blue", relation: {parent: -1, interval: "1P"}},
		{id: 1, color: "green", relation: {parent: 0, interval: "3M"}},
		{id: 2, color: "red", relation: {parent: 1, interval: "-2M"}},
		{id: 3, color: "yellow", relation: {parent: -1, interval: "5P"}},
		{id: 4, color: "orange", relation: {parent: 0, interval: "8P"}}
	]);

	const [pitches, setPitches] = useState([]);

	const getPitches = useCallback((noteSequence, keyCenter) => {
		let newPitches = [];
		noteSequence.forEach(note => {
			let pitch;
			const {relation} = note;
			if (relation.parent === -1) {
				pitch = transpose(keyCenter + "4", relation.interval);
			} else {
				const parentPitch = newPitches[relation.parent];
				if (parentPitch) {
					pitch = transpose(newPitches[relation.parent], relation.interval);
				} else {
					console.error("Parent pitch undefined");
				}
			}
			newPitches[note.id] = pitch;
		});
		console.log(newPitches);
	}, []);

	useEffect(() => {
		setPitches(getPitches(noteSequence, props.keyCenter));
	}, [noteSequence, props, getPitches]);

	return (
		<Grid columns={12} gap="1px">
			{noteSequence.map(note => (
				<Cell key={note.id} width={1} height={1}>
					<Note note={note} pitch={pitches ? pitches[note.id] : undefined} noteClicked={props.noteSelected}/>
				</Cell>
			))}
		</Grid>
	);
};

export default Sequencer;