import {useState, useEffect} from "react";
import {Grid, Cell} from "styled-css-grid";

import "../styles/Sidebar.css";

const intervalMappings = {
	"1P": "Unison", 
	"2m": "Minor 2nd",
	"2M": "Major 2nd",
	"3m": "Minor 3rd",
	"3M": "Major 3rd", 
	"4P": "Perfect 4th",
	"4A": "Tritone",
	"5P": "Perfect 5th",
	"6m": "Minor 6th",
	"6M": "Major 6th",
	"7m": "Minor 7th",
	"7M": "Major 7th",
	"8P": "Octave"
};

const durationMappings = {
	4: "Whole Note",
	3: "Dotted Half Note",
	2: "Half Note",
	1.5: "Dotted Quarter Note",
	1: "Quarter Note",
	0.75: "Dotted Eighth Note",
	0.5: "Eighth Note",
	0.25: "Sixteenth Note"
};

const Sidebar = props => {
	const {
		projectName,
		projectNameChanged,
		selectedNote,
		noteUpdated,
		deleteRequested,
		addRequested,
		clearRequested,
	} = props;

	const [parentNotes, setParentNotes] = useState([]);
	const [currentParent, setCurrentParent] = useState(undefined);
	const [currentInterval, setCurrentInterval] = useState(undefined);
	const [currentDirection, setCurrentDirection] = useState(undefined);
	const [currentDuration, setCurrentDuration] = useState(undefined);
	const [currentDelay, setCurrentDelay] = useState(undefined);
	const [name, setName] = useState(projectName);
	
	useEffect(() => {
		let prevNotes = [];
		for (let i = 0; i < selectedNote?.id; i++) {
			prevNotes.push(i); 
		}
		setParentNotes(prevNotes);
		setCurrentParent(selectedNote?.relation.parent);
		setCurrentInterval(selectedNote?.relation.interval?.slice(-2));
		setCurrentDirection(selectedNote?.relation.interval?.substring(0, 1) !== "-" ? "UP" : "DOWN");
		setCurrentDuration(selectedNote?.duration);
		setCurrentDelay(selectedNote?.delay);
	}, [selectedNote]);

	const handleNameChange = evt => {
		setName(evt.target.value);
	};

	const handleKeyPress = evt => {
		if (evt.key === "Enter") {
			projectNameChanged(evt.target.value);
			evt.target.blur();
		}
	};

	const handleParentChange = evt => {
		const newParent = evt.target.value;

		setCurrentInterval(newParent);
		let newNote = {...selectedNote};
		newNote.relation.parent = newParent;
		noteUpdated(newNote);
	};

	const handleIntervalChange = evt => {
		const newInterval = evt.target.value;

		setCurrentInterval(newInterval);
		updateInterval(newInterval);
	};

	const handleDirectionChange = evt => {
		// TODO: fix bug where after changing direction to down, sometimes it's impossible to change back to up
		const newDirection = evt.target.value;
		let newInterval = selectedNote.relation.interval;

		if (newDirection === "UP") {
			newInterval = newInterval.substring(1);
		} else if (newDirection === "DOWN") {
			newInterval = `-${newInterval}`;
		} else {
			console.error("Invalid direction value");
		}

		setCurrentDirection(newDirection);
		updateInterval(newInterval);
	};

	const updateInterval = newInterval => {
		let newNote = {...selectedNote};

		let prefix = "";
		if (currentDirection === "DOWN") {
			prefix = "-"
		}
		newNote.relation.interval = prefix + newInterval;

		noteUpdated(newNote);
	};

	const handleDurationChange = evt => {
		const newDuration = parseFloat(evt.target.value);

		setCurrentDuration(newDuration);
		let newNote = {...selectedNote};
		newNote.duration = newDuration;

		noteUpdated(newNote);
	};

	const handleDelayChange = evt => {
		const newDelay = parseFloat(evt.target.value);

		setCurrentDelay(newDelay);
		let newNote = {...selectedNote};
		newNote.delay = newDelay;

		noteUpdated(newNote);
	};

	return (
		<>
			<div className="center-text">
				<label htmlFor="project-name">Project Name: </label>
				<input
					name="project-name" 
					type="text" 
					value={name} 
					onChange={handleNameChange} 
					onBlur={evt => projectNameChanged(evt.target.value)}
					onKeyPress={handleKeyPress}
				/>
			</div>
			
			<div className="note-editor">
				<h1>Note Editor</h1>
				<Grid columns={"8rem 8rem"} justifyContent="center">
					<Cell>
						<button onClick={addRequested}>Add Note</button>
					</Cell>
					<Cell>
						<button onClick={clearRequested}>Clear Notes</button>
					</Cell>
				</Grid>
				<h2>Selected Note: {selectedNote?.id + 1 || "None"}</h2>
				{selectedNote &&
					<div className="relation-panel">
						<h3>Relation</h3>
						<Grid columns="1">
							<Cell>
								<label htmlFor="parent">Parent note: </label>
								<select name="parent" value={currentParent} onChange={handleParentChange}>
									<option key={0} value={-1}>Key Center</option>
									{parentNotes?.map((id) => (
										<option key={id} value={id}>{`Note ${id + 1}`}</option>
									))}
								</select>
							</Cell>
							<Cell>
								<label htmlFor="interval">Interval: </label>
								<select name="interval" value={currentInterval} onChange={handleIntervalChange}>
									{Object.keys(intervalMappings).map((interval, index) => (
										<option key={index} value={interval}>{intervalMappings[interval]}</option>
									))}
								</select>
							</Cell>
							<Cell>
								{
									//TODO: replace with switch component
								}
								<label htmlFor="direction">Direction: </label>
								<select name="direction" value={currentDirection} onChange={handleDirectionChange}>
									<option value={"UP"}>Up</option>
									<option value={"DOWN"}>Down</option>
								</select>
							</Cell>
						</Grid>
						<h3>Timing</h3>
						<Grid columns={1}>
							<Cell>
								<label htmlFor="duration">Duration: </label>
								<select name="duration" value={currentDuration} onChange={handleDurationChange}>
									{Object.keys(durationMappings).sort().reverse().map((duration, index) => (
										<option key={index} value={duration}>{durationMappings[duration]}</option>
									))}
								</select>
							</Cell>
							<Cell>
								<label htmlFor="delay">Delay: </label>
								<select name="delay" value={currentDelay} onChange={handleDelayChange}>
									<option key={0} value={0}>None</option>
									{Object.keys(durationMappings).sort().reverse().map((duration, index) => (
										<option key={index + 1} value={duration}>{durationMappings[duration]}</option>
									))}
								</select>
							</Cell>
						</Grid>
						<button className="btn-delete" onClick={() => deleteRequested(selectedNote)}>Delete Note</button>
					</div>
				}
			</div>
		</>
	);
};

export default Sidebar;