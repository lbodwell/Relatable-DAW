import React, {useState, useEffect} from "react";
import "../styles/Row.css";
import Pixel from "./Pixel";

const Row = props => {
	const {width, backgroundColor, notePositions, noteClicked} = props;
	const [pixels, setPixels] = useState([]);

	useEffect(() => {
		let newPixels = [];
	
		const noteColor = "	#0000FF";
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
						color = noteColor;
						pixelsLeft = note.length - 1;
						noteId = note.id;
					}
				}
			}
			
			newPixels.push(<Pixel key={i} color={color} noteId={noteId} noteClicked={noteClicked}/>);
		}

		setPixels(newPixels);
	}, [width, backgroundColor, notePositions]);

	return (
		<div className="row">
			{pixels}
		</div>
	);
};

export default Row;