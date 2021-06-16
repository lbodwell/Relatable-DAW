import {useState, useEffect} from "react";
import {Grid, Cell} from "styled-css-grid";

import "./Sidebar.css";

// TODO: make collapsable
const Sidebar = props => {
	const intervals = ["1P", "2M", "3M", "4P", "5P", "6M", "7M", "8P"];

	const [parentNotes, setParentNotes] = useState([]);
	const [test1, setTest1] = useState();
	
	useEffect(() => {
		let prevNotes = [];
		for (let i = 0; i < props.selectedNote?.id; i++) {
			prevNotes.push(i); 
		}
		setParentNotes(prevNotes);
		let foo1 = props.selectedNote?.relation.parent;
		let foo2 = props.selectedNote?.relation.interval?.slice(-2);
		let foo3 = props.selectedNote?.relation.interval?.substring(0, 1) !== "-" ? 0 : 1;
		setTest1(foo1);
		console.log("Current parent: " + foo1);
		console.log("Current interval: " + foo2);
		console.log("Current direction: " + foo3);
		// TODO: fix default values not updating with prop changes
	}, [props.selectedNote]);

	return (
		<div className="sidebar">
			<h1>Selected note: {props.selectedNote?.id ?? "None"}</h1>
			{props.selectedNote &&
				<div className="relation-panel">
					<h2>Relation</h2>
					<Grid columns="1">
						<Cell>
							<label htmlFor="parent">Parent note: </label>
							<select name="parent" defaultValue={props.selectedNote?.relation.parent}>
								<option key={0} value={-1}>Key Center</option>
								{parentNotes?.map((id) => (
									<option key={id} value={id} selected={id === props.selectedNote?.relation.parent}>{id}</option>
								))}
							</select>
						</Cell>
						<Cell>
							<label htmlFor="interval">Interval: </label>
							<select name="interval" defaultValue={props.selectedNote?.relation.interval?.slice(-2)}>
								{intervals.map((interval, index) => (
									<option key={index} value={interval}>{interval}</option>
								))}
							</select>
						</Cell>
						<Cell>
							<label htmlFor="direction">Direction: </label>
							<select name="direction" defaultValue={props.selectedNote?.relation.interval?.substring(0, 1) !== "-" ? 0 : 1}>
								<option value={0}>Up</option>
								<option value={1}>Down</option>
							</select>
						</Cell>
					</Grid>
				</div>
			}
		</div>
	);
};

export default Sidebar;