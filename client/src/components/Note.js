import "./Note.css";

const Note = props => {
	return (
		<div className="note-rectangle">
			<h1 style={{background: props.note.color, width: 48 * props.note.duration}} onClick={() => props.noteClicked(props.note)}>{props.note.id}</h1>
		</div>
	);
}

export default Note;