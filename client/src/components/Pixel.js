import {useEffect, useState} from "react";

import "../styles/Pixel.css";

const Pixel = props => {
	const {
		color,
		noteId,
		selectedNote,
		noteClicked
	} = props;

	const [pixelColor, setPixelColor] = useState(color);

	useEffect(() => setPixelColor(color), [color, noteId]);

	return (
		<div
			className={noteId !== undefined ? (noteId === selectedNote?.id ? "pixel note selected" : "pixel note") : "pixel"}
			onClick={() => noteClicked(noteId)}
			style={{backgroundColor: pixelColor}}
		/>
	);
};

export default Pixel;