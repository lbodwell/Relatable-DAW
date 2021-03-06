import {useCallback, useEffect, useState, useRef} from "react";

import ScrollContainer from "react-indiana-drag-scroll";

import {transpose} from "@tonaljs/core";
import {Note, Interval} from "@tonaljs/tonal";
import * as Tone from "tone";

import {usePrev} from "../hooks";

import socket from "../socket-connection";

import Row from "./Row";

import "../styles/Sequencer.css";

// 12 notes in one octave times 3 full octaves (C3-C5) plus 1 for C6, all times 2 rows per note
const numRows = 12 * 3 + 1;
// 4 beats per measure times 8 measures times 4 "pixels" per beat
const minSequencerLength = 4 * 8 * 4;

const durationMappings = {
	0.25: "16n",
	0.5: "8n",
	0.75: "8n.",
	1: "4n",
	1.5: "4n.",
	2: "2n",
	3: "2n.",
	4: "1m"
};

const Sequencer = props => {
	const {
		user,
		projectId,
		initNoteSequence,
		selectedNote,
		playbackStatus,
		keyCenter,
		bpm,
		volume,
		synthType,
		noteSelected,
		noteUpdated,
		noteToDelete,
		noteDeleted,
		doAddNote,
		noteAdded,
		doClearNotes,
		notesCleared,
		handleDeleteNotes,
		handleClearNotes
	} = props;
	
	const [noteSequence, setNoteSequence] = useState([]);
	const [pitches, setPitches] = useState([]);
	const [positions, setPositions] = useState([]);
	const [rows, setRows] = useState([]);
	const [sequencerLength, setSequencerLength] = useState(minSequencerLength);

	const synth = useRef(null);
	const part = useRef(null);

	const prevNote = usePrev(selectedNote);

	const handleNoteClick = useCallback(noteId => noteSelected(noteSequence[noteId]), [noteSelected, noteSequence]);

	// Delete a note and all its descendants from the note sequence
	const deleteNote = useCallback(targetNoteId => {
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

		return newNoteSequence;
	}, [noteSequence, noteDeleted, noteSelected]);

	useEffect(() => {
		const newSynth = new Tone.Synth({
			oscillator: {
				volume: volume ?? 0,
				type: synthType ?? "sine"
			}
		}).toDestination();

		synth.current = newSynth;
	}, [volume, synthType]);

	// Delete and clear notes on socket emissions
	useEffect(() => {
		if (user && projectId) {
			socket.on("noteDeleted", ({deletedNote}) => {
				deleteNote(deletedNote.id);
			});
	
			socket.on("notesCleared", () => {
				setNoteSequence([]);
				notesCleared(false);
				noteSelected(null);
			});
		}
	}, [user, projectId, deleteNote, noteSelected, notesCleared]);

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
				pitch = transpose(keyCenter + "4", relation.interval);
			} else {
				const parentPitch = newPitches[relation.parent];

				if (parentPitch) {
					pitch = Note.simplify(transpose(newPitches[relation.parent], relation.interval));
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
				const verticalPos = -1 * Interval.semitones(Interval.distance("C6", pitches[note.id]));
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
		});
		
		for (let i = 0; i < numRows; i++) {
			newRows.push({
				rowId: i,
				notePositions: positionsMap[i] ?? []
			});
		}

		setRows(newRows);
	}, [noteSequence, positions]);

	// Audio playback
	useEffect(() => {
		if (playbackStatus === "Playing") {
			if (!part.current) {
				let partSequence = [];
				let end;

				noteSequence.forEach(note => {
					const start = positions[note.id]?.horizontalPos / 4;
					const time = `${Math.floor(start / 4)}:${start % 4}`;
					const duration = durationMappings[note.duration];

					if (note.id === noteSequence.length - 1) {
						const timeInSeconds = Tone.Time(time).toSeconds();
						const durationInSeconds = Tone.Time(duration).toSeconds();
						const endOfLastNote = Tone.Time(timeInSeconds + durationInSeconds).toBarsBeatsSixteenths();
						const barBeatsSixteenths = endOfLastNote.split(":");

						if (barBeatsSixteenths[1] === "0" && barBeatsSixteenths[2] === "0") {
							end = endOfLastNote;
						} else {
							end = (parseInt(barBeatsSixteenths[0]) + 1).toString() + ":0:0"
						}
					}

					partSequence.push([time, {
						pitch: pitches[note.id],
						duration
					}]);
				});

				const newPart = new Tone.Part((time, note) => {
					synth.current.triggerAttackRelease(note.pitch, note.duration, time);
				}, partSequence);
				
				newPart.loopStart = 0;
				newPart.loopEnd = end;
				newPart.loop = true;
				newPart.start();
				part.current = newPart;
			}

			Tone.Transport.bpm.value = bpm;
			Tone.Transport.start();
		} else if (playbackStatus === "Paused") {
			Tone.Transport.pause();
		} else if (playbackStatus === "Stopped") {
			Tone.Transport.stop();
		}
	}, [noteSequence, pitches, playbackStatus, synth, positions, bpm]);

	// Update note sequence on edit
	useEffect(() => {
		if (prevNote !== selectedNote && selectedNote != null) {
			let newNoteSequence = [...noteSequence];
			newNoteSequence[selectedNote.id] = selectedNote;

			setNoteSequence(newNoteSequence);
		}
	}, [noteSequence, selectedNote, prevNote, keyCenter]);

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

	// Update part on note sequence, or key change
	useEffect(() => {
		if (noteSequence && part.current) {
			Tone.Transport.pause();
			part.current.stop();
			part.current.dispose();
			part.current = null;
		}
	}, [noteSequence, keyCenter]);

	// Detect user-initiated note deletion
	// TODO: Add id cascading for remaining notes after deletion and fix duplicate component key errors
	useEffect(() => {
		const targetNoteId = noteToDelete?.id;

		if (!targetNoteId) {
			return;
		}

		const newSequence = deleteNote(targetNoteId);
		if (user && projectId) {
			handleDeleteNotes(noteToDelete, newSequence);
		} 

	}, [user, projectId, noteToDelete, deleteNote, handleDeleteNotes]);

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