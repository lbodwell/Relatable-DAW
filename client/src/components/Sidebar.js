import {useState, useEffect} from "react";
import {Grid, Cell} from "styled-css-grid";

import "./Sidebar.css";

// TODO: make collapsable
const Sidebar = props => {
	const intervalMappings = {
		"1P": "Unison", 
		"2m": "Minor 2nd",
		"2M": "Major 2nd",
		"3m": "Minor 3rd",
		"3M": "Major 3rd", 
		"4P": "Perfect 4th", 
		"5P": "Perfect 5th",
		"6m": "Minor 6th",
		"6M": "Major 6th",
		"7m": "Minor 7th",
		"7M": "Major 7th",
		"8P": "Octave"
	};

	const [parentNotes, setParentNotes] = useState([]);
	const [currentParent, setCurrentParent] = useState();
	const [currentInterval, setCurrentInterval] = useState();
	const [currentDirection, setCurrentDirection] = useState();
	
	useEffect(() => {
		let prevNotes = [];
		for (let i = 0; i < props.selectedNote?.id; i++) {
			prevNotes.push(i); 
		}
		setParentNotes(prevNotes);
		setCurrentParent(props.selectedNote?.relation.parent);
		setCurrentInterval(props.selectedNote?.relation.interval?.slice(-2));
		setCurrentDirection(props.selectedNote?.relation.interval?.substring(0, 1) !== "-" ? "0" : "1");
	}, [props.selectedNote]);

	const handleParentChange = evt => {
		const newParent = evt.target.value;

		setCurrentInterval(newParent);
		let newNote = {...props.selectedNote};
		newNote.relation.parent = newParent;
		props.noteUpdated(newNote);
	};

	const handleIntervalChange = evt => {
		const newInterval = evt.target.value;

		setCurrentInterval(newInterval);
		updateInterval(newInterval);
	};

	const handleDirectionChange = evt => {
		const newDirection = evt.target.value;
		console.log(newDirection);
		let newInterval = props.selectedNote.relation.interval;

		if (newDirection === "0") {
			newInterval = newInterval.substring(1);
		} else if (newDirection === "1") {
			newInterval = `-${newInterval}`;
		} else {
			console.error("Invalid direction value");
		}

		setCurrentDirection(newDirection);
		updateInterval(newInterval);
	};

	const updateInterval = newInterval => {
		let newNote = {...props.selectedNote};
		newNote.relation.interval = newInterval;
		props.noteUpdated(newNote);
	};

	return (
		<div className="sidebar">
			<h1>Selected note: {props.selectedNote?.id ?? "None"}</h1>
			{props.selectedNote &&
				<div className="relation-panel">
					<h2>Relation</h2>
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
							<label htmlFor="direction">Direction: </label>
							<select name="direction" value={currentDirection} onChange={handleDirectionChange}>
								<option value={0}>Up</option>
								<option value={1}>Down</option>
							</select>
						</Cell>
						<Cell>
							<button onClick={() => props.deleteRequested(props.selectedNote)}>Delete Note</button>
						</Cell>
					</Grid>
				</div>
			}
		</div>
	);
};

export default Sidebar;