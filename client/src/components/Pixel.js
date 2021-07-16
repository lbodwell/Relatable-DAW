import {useEffect, useRef, useState} from "react";

import {usePrev} from "../hooks";

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

	const pixelRef = useRef(null);

	const prevNote = usePrev(selectedNote);

	// useEffect(() => {
	// 	// TODO: fix issue with animation restarting as soon as note is clicked (usePrev doesn't seem to be working)
	// 	if (selectedNote?.id !== undefined && noteId === selectedNote?.id && prevNote?.id === selectedNote?.id) {
	// 		pixelRef.current.style.animationName = undefined;
	// 		setTimeout(() => pixelRef.current.style.animation = "", 1);
	// 	}
	// }, [noteId, selectedNote, prevNote]);
	
	return (
		<div
			className={noteId !== undefined ? (noteId === selectedNote?.id ? "pixel note selected" : "pixel note") : "pixel"}
			onClick={() => noteClicked(noteId)}
			style={{backgroundColor: pixelColor}}
			ref={pixelRef}
		/>
	);
};

export default Pixel;