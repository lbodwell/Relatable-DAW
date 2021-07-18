import {useEffect, useState} from "react";

import {
	Button,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from "@material-ui/core";

import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';

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
		user,
		projectId,
		projectName,
		projectNameChanged,
		selectedNote,
		noteUpdated,
		deleteRequested,
		addRequested,
		clearRequested,
	} = props;

	const [localProjectName, setLocalProjectName] = useState("");
	const [parentNotes, setParentNotes] = useState([]);
	const [currentParent, setCurrentParent] = useState(null);
	const [currentInterval, setCurrentInterval] = useState(null);
	const [currentDirection, setCurrentDirection] = useState(null);
	const [currentDuration, setCurrentDuration] = useState(null);
	const [currentDelay, setCurrentDelay] = useState(null);
	
	useEffect(() => {
		let prevNotes = [];
		for (let i = 0; i < selectedNote?.id; i++) {
			prevNotes.push(i); 
		}
		setParentNotes(prevNotes);
		if (selectedNote) {
			setCurrentParent(selectedNote?.relation.parent);
			setCurrentInterval(selectedNote?.relation.interval?.slice(-2));
			setCurrentDirection(selectedNote?.relation.interval?.substring(0, 1) !== "-" ? "UP" : "DOWN");
			setCurrentDuration(selectedNote?.duration);
			setCurrentDelay(selectedNote?.delay);
		} else {
			setCurrentParent(null);
			setCurrentInterval(null);
			setCurrentDirection(null);
			setCurrentDuration(null);
			setCurrentDelay(null);
		}
	}, [selectedNote]);

	useEffect(() => {
		if (projectName) {
			setLocalProjectName(projectName);
		}
		
	}, [projectName]);

	const handleNameChange = evt => {
		setLocalProjectName(evt.target.value);
	};

	const handleKeyPress = evt => {
		if (evt.key === "Enter") {
			evt.target.blur();
		}
	};

	const handleParentChange = evt => {
		const newParent = parseInt(evt.target.value);

		setCurrentInterval(newParent);
		let newNote = {...selectedNote};
		newNote.relation.parent = newParent;
		noteUpdated(newNote);
	};

	const handleIntervalChange = evt => {
		const newInterval = evt.target.value;
		let newNote = {...selectedNote};

		let prefix = "";
		if (currentDirection === "DOWN") {
			prefix = "-"
		}
		newNote.relation.interval = prefix + newInterval;

		setCurrentInterval(newInterval);
		noteUpdated(newNote);
	};

	const handleDirectionChange = evt => {
		const newDirection = evt.target.value;
		let newNote = {...selectedNote};
		let newInterval = newNote.relation.interval;

		if (newDirection === "UP") {
			newInterval = newInterval.substring(1);
		} else if (newDirection === "DOWN") {
			newInterval = `-${newInterval}`;
		} else {
			console.error("Invalid direction value");
		}
		newNote.relation.interval = newInterval;

		setCurrentDirection(newDirection);
		setCurrentInterval(newInterval);
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
			{(user && projectId) &&
				<div className="center-text">
					<TextField
						label="Project name"
						variant="outlined"
						size="small"
						value={localProjectName}
						style={{width: "16rem", marginTop: "1rem"}}
						onChange={handleNameChange}
						onBlur={evt => projectNameChanged(evt.target.value)}
						onKeyPress={handleKeyPress}
					/>
				</div>
			}
			<div className="note-editor">
				<Typography variant="h4" style={{fontWeight: "bold", marginTop: "2rem", marginBottom: "1rem"}}>
					Note Editor
				</Typography>
				<Grid container justifyContent="space-evenly">
					<Grid item>
						<Button
							variant="contained"
							size="small"
							color="primary"
							startIcon={<AddIcon/>}
							onClick={() => addRequested(true)}>
							Add note
						</Button>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							size="small"
							color="primary"
							startIcon={<ClearIcon/>}
							onClick={() => clearRequested(true)}>
							Clear notes
						</Button>
					</Grid>
				</Grid>
				<Typography variant="h5" style={{fontWeight: "bold", marginTop: "2rem"}}>Selected note: {selectedNote?.id + 1 || "None"}</Typography>
				{selectedNote &&
					<div>
						<Typography variant="h6" style={{fontWeight: "bold", marginTop: "2rem", marginBottom: "1rem"}}>Relation</Typography>
						<Grid container direction="row" justifyContent="space-evenly" spacing="2">
							<Grid item>
								<InputLabel id="parent" shrink>Parent note</InputLabel>
								<Select
									labelId="parent"
									value={currentParent}
									onChange={handleParentChange}>
									<MenuItem key={0} value={-1}>Tonic</MenuItem>
									{parentNotes?.map((id) => (
										<MenuItem key={id + 1} value={id}>{`Note ${id + 1}`}</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item>
								<InputLabel id="interval" shrink>Interval</InputLabel>
								<Select
									labelId="interval"
									value={currentInterval} 
									onChange={handleIntervalChange}>
									{Object.keys(intervalMappings).map((interval, index) => (
										<MenuItem key={index} value={interval}>{intervalMappings[interval]}</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item>
								<InputLabel id="direction" shrink>Interval</InputLabel>
								<Select
									labelId="direction"
									value={currentDirection} 
									onChange={handleDirectionChange}>
									<MenuItem value={"UP"}>Up</MenuItem>
									<MenuItem value={"DOWN"}>Down</MenuItem>
								</Select>
							</Grid>
						</Grid>
						<Typography variant="h6" style={{fontWeight: "bold", marginTop: "2rem", marginBottom: "1rem"}}>Timing</Typography>
						<Grid container direction="row" justifyContent="space-evenly" spacing="2">
							<Grid item>
								<InputLabel id="duration" shrink>Duration</InputLabel>
								<Select
									labelId="duration"
									value={currentDuration} 
									onChange={handleDurationChange}>
									{Object.keys(durationMappings).sort().reverse().map((duration, index) => (
										<MenuItem key={index} value={duration}>{durationMappings[duration]}</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item>
								<InputLabel id="delay" shrink>Delay</InputLabel>
								<Select
									labelId="delay"
									value={currentDelay} 
									onChange={handleDelayChange}>
									<MenuItem key={0} value={0}>None</MenuItem>
									{Object.keys(durationMappings).sort().reverse().map((duration, index) => (
										<MenuItem key={index + 1} value={duration}>{durationMappings[duration]}</MenuItem>
									))}
								</Select>
							</Grid>
						</Grid>
						<Button
							variant="contained"
							size="small"
							color="primary"
							startIcon={<DeleteIcon/>}
							style={{marginTop: "4rem"}}
							onClick={() => deleteRequested(selectedNote)}>
							Delete note
						</Button>
					</div>
				}
			</div>
		</>
	);
};

export default Sidebar;