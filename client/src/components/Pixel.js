import React, {useState, useEffect} from "react";
import "../styles/Pixel.css";

const Pixel = props => {
	const {color, noteId, noteClicked} = props;

	const [pixelColor, setPixelColor] = useState(color);

	useEffect(() => {
		setPixelColor(color);
	}, [color, noteId]);

	const handlePixelClick = () => {
		if (noteId !== undefined) {
			noteClicked(noteId);
		}
	};

	return (
		<div className={noteId !== undefined ? "pixel note" : "pixel"} onClick={handlePixelClick} style={{backgroundColor: pixelColor}}/>
	);
};

export default Pixel;