import {useCallback, useEffect, useState} from "react";

import ScrollContainer from "react-indiana-drag-scroll";

import {transpose} from "@tonaljs/core";
import {Interval} from "@tonaljs/tonal";
import * as Tone from "tone";

import {usePrev} from "../hooks";

import socket from "../socket-connection";

import Row from "./Row";

import "../styles/Sequencer.css";

// 12 notes in one octave times 5 full octaves (C3-C6) plus 1 for C7, all times 2 rows per note
const numRows = (12 * 4 + 1) * 2;
// 4 beats per measure times 8 measures times 4 "pixels" per beat
const minSequencerLength = 4 * 8 * 4;

const Sequencer = props => {
	const {
		initNoteSequence,
		selectedNote,
		playbackStatus,
		keyCenter,
		noteSelected,
		noteUpdated,
		noteToDelete,
		noteDeleted,
		doAddNote,
		noteAdded,
		doClearNotes,
		notesCleared,
		handleClearNotes
	} = props;
	
	const [synth, setSynth] = useState(null);
	const [noteSequence, setNoteSequence] = useState([]);
	const [pitches, setPitches] = useState([]);
	const [positions, setPositions] = useState([]);
	const [rows, setRows] = useState([]);
	const [sequencerLength, setSequencerLength] = useState(minSequencerLength);

	const prevNote = usePrev(selectedNote);

	const handleNoteClick = useCallback(noteId => noteSelected(noteSequence[noteId]), [noteSelected, noteSequence]);

	// Initial setup
	useEffect(() => {
		//console.log("on load");
		setSynth(new Tone.Synth().toDestination());
	}, []);

	useEffect(() => {
		socket.on("notesCleared", () => {
			setNoteSequence([]);
			notesCleared(false);
			noteSelected(null);
		});
	}, [noteSelected, notesCleared]);

	useEffect(() => {
		if (initNoteSequence) {
			setNoteSequence(initNoteSequence);
		}
	}, [initNoteSequence]);

	// Pitch calculation
	useEffect(() => {
		let newPitches = [];

		noteSequence.forEach(note => {
			let pitch;
			const {relation} = note;

			if (relation.parent === -1) {
				pitch = transpose(keyCenter + "5", relation.interval);
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
				numBeats += note.delay;
				const horizontalPos = 4 * numBeats;
				const verticalPos = -2 * Interval.semitones(Interval.distance("C7", pitches[note.id]));
				newPositions[note.id] = {horizontalPos, verticalPos};
				numBeats += note.duration;
			});

			const numBeatsPlusOffset = Math.ceil(numBeats / 4) * 4 + 4;
			setSequencerLength(Math.max(4 * numBeatsPlusOffset, minSequencerLength));
		}

		setPositions(newPositions);
	}, [noteSequence, pitches]);

	// Prepare piano roll grid rows for rendering
	useEffect(() => {
		let newRows = [];
		let positionsMap = [];

		positions.forEach((pos, index) => {
			positionsMap[pos.verticalPos] = [...positionsMap[pos.verticalPos] ?? [], {
				id: index,
				start: pos.horizontalPos,
				length: noteSequence[index]?.duration * 4
			}];
			positionsMap[pos.verticalPos + 1] = positionsMap[pos.verticalPos];
		});
		
		for (let i = 0; i < numRows; i++) {
			newRows.push({rowId: i, notePositions: positionsMap[i]});
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

	// Update note sequence on edit
	useEffect(() => {
		// TODO: handle selectedNote separately from updated notes received from socket.io
		if (prevNote !== selectedNote && selectedNote != null) {
			let newNoteSequence = [...noteSequence];
			newNoteSequence[selectedNote.id] = selectedNote;

			setNoteSequence(newNoteSequence);
		}
	}, [noteSequence, selectedNote, prevNote]);

	// Add new note
	useEffect(() => {
		if (doAddNote) {
			const defaultParent = selectedNote ?? noteSequence[noteSequence.length - 1];
			const newNote = {
				id: noteSequence.length,
				duration: selectedNote?.duration ?? 1,
				delay: 0,
				relation: {
					parent: defaultParent?.id ?? -1,
					interval: "1P"
				}
			};

			setNoteSequence([...noteSequence, newNote]);
			noteAdded(false);
			noteSelected(newNote);
			noteUpdated(newNote);
		}
	}, [noteSequence, selectedNote, doAddNote, noteAdded, noteSelected, noteUpdated]);

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
				});
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
			handleClearNotes();
			noteSelected(null);
		}
	}, [doClearNotes, notesCleared, handleClearNotes, noteSelected]);

	return (
		<ScrollContainer className="piano-roll" hideScrollbars={false}>
			{rows.map((row, index) => (
				<Row
					key={index}
					rowId={row.rowId}
					width={sequencerLength}
					notePositions={row.notePositions}
					keyCenter={keyCenter}
					selectedNote={selectedNote}
					noteClicked={handleNoteClick}
				/>
			))}
		</ScrollContainer>
	);
};

export default Sequencer;