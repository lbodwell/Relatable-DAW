import {Grid, Cell} from "styled-css-grid";

import "../styles/OptionsManager.css"

const keys = [
	"C",
	"G",
	"D",
	"A",
	"E",
	"B",
	"Gb",
	"Db", 
	"Ab",
	"Eb",
	"Bb",
	"F"
];

const OptionsManager = props => {
	const {
		keyCenter,
		keyChanged,
		bpm,
		bpmChanged,
		volume,
		volChanged,
		updatePlayback,
		playbackButtonText
	} = props;
	
	return (
		<div className="options">
			<Grid columns={"0.25rem 5rem 10rem 12rem"} gap="6rem">
				<Cell>
					<button onClick={updatePlayback}>{playbackButtonText}</button>
				</Cell>
				<Cell>
					<Grid columns={2}>
						<Cell>
							<label htmlFor="keyCenter">Key:</label>
						</Cell>
						<Cell>
							<select name="keyCenter" value={keyCenter} onChange={evt => keyChanged(evt.target.value)}>
								{keys.map((key, index) => (
									<option key={index} value={key}>{`${key} Major`}</option>
								))}
							</select>
						</Cell>
					</Grid>
				</Cell>
				<Cell>
					<Grid columns={2}>
						<Cell>
							<label htmlFor="bpm">BPM: {bpm}</label>
						</Cell>
						<Cell>
							<input name="bpm" type="range" value={bpm} min="60" max="200" onChange={evt => bpmChanged(evt.target.value)}/>
						</Cell>
					</Grid>
				</Cell>
				<Cell>
					<Grid columns={2}>
						<Cell>
							<label htmlFor="volume">Volume: {volume}</label>
						</Cell>
						<Cell>
							<input name="volume" type="range" value={volume} min="0" max="100" onChange={evt => volChanged(evt.target.value)}/>
						</Cell>
					</Grid>
				</Cell>
			</Grid>
		</div>
	);
};

export default OptionsManager;