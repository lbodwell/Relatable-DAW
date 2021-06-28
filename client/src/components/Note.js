import "../styles/Note.css";

const Note = ({note, noteClicked}) => {
	return (
		<div className="note-rectangle">
			<h1 style={{background: "blue", width: 48 * note.duration}} onClick={() => noteClicked(note)}>{note.id + 1}</h1>
		</div>
	);
}

export default Note;