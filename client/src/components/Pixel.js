import React, {useState, useEffect} from "react";
import "../styles/Pixel.css";

const Pixel = props => {
	const {color, noteId, selectedNote, noteClicked} = props;

	const [pixelColor, setPixelColor] = useState(color);

	useEffect(() => setPixelColor(color), [color, noteId]);
	useEffect(() => {
	}, [noteId, selectedNote]);

	const handlePixelClick = () => noteClicked(noteId);

	return (
		<div
			className={noteId !== undefined ? (noteId === selectedNote?.id ? "pixel note selected" : "pixel note") : "pixel"}
			onClick={handlePixelClick}
			style={{backgroundColor: pixelColor}}
		/>
	);
};

export default Pixel;