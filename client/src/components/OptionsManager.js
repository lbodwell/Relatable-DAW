import {Grid, Cell} from "styled-css-grid";

import "../styles/OptionsManager.css";

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
	const {keyCenter, keyChanged, bpm, bpmChanged} = props;
	
	return (
		<div className="options">
			<Grid columns={"8rem 12rem"} justifyContent="center" gap="2rem">
				<Cell center middle>
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
				<Cell center middle>
					<Grid columns={2}>
						<Cell>
							<label htmlFor="bpm">BPM ({bpm}):</label>
						</Cell>
						<Cell>
							<input name="bpm" type="range" value={bpm} min="60" max="200" onChange={evt => bpmChanged(evt.target.value)}/>
						</Cell>
					</Grid>
				</Cell>
			</Grid>
		</div>
	);
};

export default OptionsManager;