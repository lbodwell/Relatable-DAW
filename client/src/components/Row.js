import React, {useState, useEffect} from "react";

import {Interval} from "@tonaljs/tonal";

import Pixel from "./Pixel";

import "../styles/Row.css";

const gridColor1 = "#555555";
const gridColor2 = "#1b1b1b";

const noteColors = [
	"#FF0000",
	"#FF00FF",
	"#FF69B4",
	"#800080",
	"#4B0082",
	"#0000FF",
	"#87CEFA",
	"#008B8B",
	"#006400",
	"#00FF00",
	"#FFFF00",
	"#FF4500"
];

const Row = props => {
	const {
		rowId,
		width,
		notePositions,
		keyCenter,
		selectedNote,
		noteClicked
	} = props;
	
	const backgroundColor = rowId % 4 <= 1 ? gridColor1 : gridColor2;
	const offset = Interval.semitones(Interval.distance("C5", keyCenter + "5"));

	const [pixels, setPixels] = useState([]);

	useEffect(() => {
		let newPixels = [];
		let color = backgroundColor;
		let pixelsLeft = 0;
		let noteId = undefined;
		
		for (let i = 0; i < width; i++) {
			if (pixelsLeft > 0) {
				pixelsLeft--;
			} else if (notePositions) {
				color = backgroundColor;
				noteId = undefined;
				for (let j = 0; j < notePositions.length; j++) {
					let note = notePositions[j];
					if (i === note.start) {
						color = noteColors[(Math.floor(rowId / 2) + offset) % 12];
						pixelsLeft = note.length - 1;
						noteId = note.id;
					}
				}
			}
			newPixels.push({color, noteId});
		}

		setPixels(newPixels);
	}, [rowId, width, keyCenter, notePositions, noteClicked, backgroundColor, offset]);

	return (
		<div className="row">
			{pixels.map((pixel, index) => (
				<Pixel
					key={index}
					color={pixel.color}
					noteId={pixel.noteId}
					selectedNote={selectedNote}
					noteClicked={noteClicked}
				/>
			))}
		</div>
	);
};

export default Row;