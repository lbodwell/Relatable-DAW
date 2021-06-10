import "./Note.css";

const Note = props => {
	return (
		<div className="note-rectangle">
			<h1 style={{background: props.note.color}} onClick={() => props.noteClicked(props.note)}>{props.note.id}</h1>
		</div>
	);
}

export default Note;