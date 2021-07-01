import React, {useState, useEffect} from "react";
import "../styles/Row.css";
import Pixel from "./Pixel";

const Row = props => {
	const {width, backgroundColor, notePositions} = props;
	const [pixels, setPixels] = useState([]);

	useEffect(() => {
		let newPixels = [];
	
		const noteColor = "	#0000FF";
		let color = backgroundColor;
		let pixelsLeft = 0;

		for (let i = 0; i < width; i++) {	
			if (pixelsLeft > 0) {
				pixelsLeft--;
			} else if (notePositions) {
				color = backgroundColor;
				for (let j = 0; j < notePositions.length; j++) {
					let note = notePositions[j];
					if (i === note.start) {
						color = noteColor;
						pixelsLeft = note.length - 1;
					}
				}
			}
			
			newPixels.push(<Pixel key={i} color={color}/>);
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