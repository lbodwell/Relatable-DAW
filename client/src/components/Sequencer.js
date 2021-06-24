import {useState, useEffect} from "react";
import {Grid, Cell} from "styled-css-grid";
import {transpose} from "@tonaljs/core";
import {Interval} from "@tonaljs/tonal";
import * as Tone from "tone";

import Note from "./Note";

import "./Sequencer.css";

const Sequencer = props => {
	// TODO: make more robust

	const [synth, setSynth] = useState(null);

	const [noteSequence, setNoteSequence] = useState([
		{id: 0, color: "blue", duration: 2, relation: {parent: -1, interval: "1P"}, children: [1, 3]},
		{id: 1, color: "blue", duration: 1, relation: {parent: 0, interval: "3M"}, children: [2]},
		{id: 2, color: "blue", duration: 1, relation: {parent: 1, interval: "-2M"}, children: []},
		{id: 3, color: "blue", duration: 2, relation: {parent: 0, interval: "4P"}, children: [6]},
		{id: 4, color: "blue", duration: 0.5, relation: {parent: -1, interval: "8P"}, children: [5]},
		{id: 5, color: "blue", duration: 0.5, relation: {parent: 4, interval: "-2M"}, children: []},
		{id: 6, color: "blue", duration: 1, relation: {parent: 3, interval: "1P"}, children: [7]},
		{id: 7, color: "blue", duration: 4, relation: {parent: 6, interval: "-4P"}, children: []}
	]);

	const [pitches, setPitches] = useState([]);
	const [positions, setPositions] = useState([]);

	useEffect(() => {
		console.log("on load");
		// TODO: add note sequence load from database
		setSynth(new Tone.Synth().toDestination());
	}, []);

	useEffect(() => {
		let newPitches = [];
		noteSequence.forEach(note => {
			let pitch;
			const {relation} = note;
			if (relation.parent === -1) {
				pitch = transpose(props.keyCenter + "4", relation.interval);
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
		setPitches(newPitches);
	}, [noteSequence, props]);

	useEffect(() => {
		let newPositions = [];
		if (pitches) {
			let numBeats = 0;
			noteSequence.forEach(note => {
				// 36 is current max number of supported notes (C3-C6)
				// Still needs some debugging
				const horizontalPos = 8 * numBeats + 1;
				const verticalPos = 36 - Interval.semitones(Interval.distance("C3", pitches[note.id]));
				newPositions[note.id] = {horizontalPos, verticalPos};
				numBeats += note.duration;
			});
		}
		setPositions(newPositions);
	}, [noteSequence, pitches]);

	useEffect(() => {
		const targetNoteId = props.noteToDelete?.id;
		if (!targetNoteId) {
			return;
		}

		let children = [];
		// TODO: also check children's children, etc.
		noteSequence.forEach(note => {
			if (note.relation.parent === targetNoteId) {
				children.push(note);
			}
		});

		if (children.length > 0) {
			console.log(`This will delete ${children.length} children`);
			// TODO: look into awaiting confirmation dialog

			for (let i = children.length - 1; i >= 0; i--) {
				// TODO: Use splice to mutate noteSequence removing all children then the parent

			}
		}
	}, [noteSequence, props.noteToDelete]);

	useEffect(() => {
		const durationMappings = {0.5: "2n", 1: "4n", 2: "8n", 4: "1m"};
		// ? Firing twice for some reason
		console.log(props.playbackStatus);
		Tone.Transport.pause();
		if (props.playbackStatus === "Playing") {
			let test = [];
			noteSequence.forEach(note => {
				test.push({pitch: pitches[note.id], duration: durationMappings[note.duration]})
			});
			console.log(test);
			const part = new Tone.Part((time, note) => {
				synth.triggerAttackRelease(note.pitch, note.duration, time);
			}, test);
			Tone.Transport.start();
			
			//part.start();
		}
		
	}, [noteSequence, pitches, props.playbackStatus, synth]);

	return (
		<div className="piano-roll">
			<Grid columns={240} rows={36} gap="0px">
				{noteSequence.map(note => (
					<Cell left={positions[note.id]?.horizontalPos} top={positions[note.id]?.verticalPos} key={note.id} width={8 * note.duration} height={1}>
						<Note note={note} pitch={pitches?.[note.id]} noteClicked={props.noteSelected}/>
					</Cell>
				))}
			</Grid>
		</div>
	);
};

export default Sequencer;