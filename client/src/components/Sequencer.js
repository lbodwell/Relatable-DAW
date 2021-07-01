import {useState, useEffect} from "react";
import {transpose} from "@tonaljs/core";
import {Interval} from "@tonaljs/tonal";
import * as Tone from "tone";

import {usePrev} from "../hooks";
import Row from "./Row";

import "../styles/Sequencer.css";

const Sequencer = props => {
	const {
		selectedNote,
		playbackStatus,
		keyCenter,
		noteSelected,
		noteToDelete,
		noteDeleted,
		doAddNote,
		noteAdded,
		doClearNotes,
		notesCleared
	} = props;
	
	const [synth, setSynth] = useState(null);
	const [noteSequence, setNoteSequence] = useState([
		{id: 0, duration: 2, relation: {parent: -1, interval: "1P"}},
		{id: 1, duration: 1, relation: {parent: 0, interval: "3M"}},
		{id: 2, duration: 1, relation: {parent: 1, interval: "-2M"}},
		{id: 3, duration: 2, relation: {parent: 0, interval: "4P"}},
		{id: 4, duration: 0.5, relation: {parent: -1, interval: "8P"}},
		{id: 5, duration: 0.5, relation: {parent: 4, interval: "-2M"}},
		{id: 6, duration: 1, relation: {parent: 3, interval: "1P"}},
		{id: 7, duration: 4, relation: {parent: 6, interval: "-4P"}}
	]);
	const [pitches, setPitches] = useState([]);
	const [positions, setPositions] = useState([]);
	const [rows, setRows] = useState([]);

	const prevNote = usePrev(selectedNote);

	// Initial setup
	useEffect(() => {
		//console.log("on load");
		// TODO: Load note sequence from database
		setSynth(new Tone.Synth().toDestination());
	}, []);

	// Pitch calculation
	useEffect(() => {
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
		setPitches(newPitches);
	}, [noteSequence, keyCenter]);

	// Note positioning
	useEffect(() => {
		let newPositions = [];
		if (pitches) {
			let numBeats = 0;
			noteSequence.forEach(note => {
				// 36 is current max number of supported notes (C3-C6)
				// Still needs some debugging
				const horizontalPos = 4 * numBeats;
				const verticalPos = -2 * Interval.semitones(Interval.distance("C6", pitches[note.id]));
				newPositions[note.id] = {horizontalPos, verticalPos};
				numBeats += note.duration;
			});
		}
		setPositions(newPositions);
	}, [noteSequence, pitches]);

	useEffect(() => {
		const gridColor1 = "#555555";
		const gridColor2 = "#1b1b1b";
		
		let newRows = [];
		let color;
		let positionsMap = [];

		positions.forEach((pos, index) => {
			positionsMap[pos.verticalPos] = [...positionsMap[pos.verticalPos] ?? [], {
				id: index,
				start: pos.horizontalPos,
				length: noteSequence[index].duration * 4
			}];
			positionsMap[pos.verticalPos + 1] = positionsMap[pos.verticalPos];
		});
		//console.log(positionsMap);
		
		// TODO: don't hard code width and height
		for (let i = 0; i < 72; i++) {
			color = i % 4 <= 1 ? gridColor1 : gridColor2;
			newRows.push(<Row key={i} width={128} backgroundColor={color} notePositions={positionsMap[i]}/>);
		}

		setRows(newRows);
	}, [noteSequence, positions]);

	// Audio playback
	useEffect(() => {
		const durationMappings = {0.25: "1n", 0.5: "2n", 1: "4n", 2: "8n", 4: "1m"};
		// ? Firing twice for some reason
		//console.log(playbackStatus);
		Tone.Transport.pause();
		if (playbackStatus === "Playing") {
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
		
	}, [noteSequence, pitches, playbackStatus, synth]);

	useEffect(() => {
		if (prevNote !== selectedNote && selectedNote != null) {
			let newNoteSequence = [...noteSequence];
			newNoteSequence[selectedNote.id] = selectedNote;
			setNoteSequence(newNoteSequence);
		}
		
	}, [noteSequence, selectedNote, prevNote]);

	// Add new note
	useEffect(() => {
		if (doAddNote) {
			const lastNote = noteSequence[noteSequence.length - 1];
			const prevDuration = lastNote.duration;
			const defaultRelation = {parent: lastNote.id, interval: "1P"};

			const newNote = {
				id: noteSequence.length,
				duration: prevDuration,
				relation: defaultRelation,
				children: []
			};
			setNoteSequence([...noteSequence, newNote]);
			noteAdded(false);
			noteSelected(newNote);
		}
	}, [noteSequence, doAddNote, noteAdded, noteSelected]);

	// Delete a note
	// TODO: Add id cascading for remaining notes after deletion and fix duplicate component key errors
	useEffect(() => {
		const targetNoteId = noteToDelete?.id;
		if (!targetNoteId) {
			return;
		}  

		let targets = [targetNoteId];
		noteSequence.forEach(note => {
			if (targets.every(target => target.id !== note.id)) {
				targets.forEach(target => {
					if (note.relation.parent === target) {
						targets.push(note.id);
					}
				})
			}
		});

		if (targets.length > 0) {
			console.log(`This will delete ${targets.length - 1} descendant notes`);
			// TODO: look into awaiting confirmation dialog
		}
		const newNoteSequence = [...noteSequence].filter(note => !targets.includes(note.id));
		setNoteSequence(newNoteSequence);

		noteDeleted(null);
		noteSelected(null);
	}, [noteSequence, noteToDelete, noteDeleted, noteSelected]);

	// Clear all notes
	useEffect(() => {
		if (doClearNotes) {
			setNoteSequence([]);
			notesCleared(false);
			noteSelected(null);
		}
	}, [doClearNotes, notesCleared, noteSelected]);

	return (
		<div className="piano-roll">
			{rows}
		</div>
	);
};

export default Sequencer;