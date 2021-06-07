import "./Note.css";

const Note = props => {
	const noteClicked = () => {
		console.log(props);
	}
	return (
		<div className="note-rectangle">
			<h1 style={{background: props.color}} onClick={noteClicked}>{props.id}</h1>
		</div>
	);
}

export default Note;