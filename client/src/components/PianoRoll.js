import React from "react";
import Row from "./Row";

import "../styles/PianoRoll.css";

const PianoRoll = props => {
	const {width, height, noteSequence} = props;

	let rows = [];

	for (let i = 0; i < height; i++) {
		rows.push(<Row key={i} width={width} selectedColor={"#ffffff"}/>);
	}
	
	return (
		<h1>Test</h1>
	);
};

export default PianoRoll;