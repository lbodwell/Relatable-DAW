import {useEffect, useState} from "react";

import {Cell, Grid} from "styled-css-grid";

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
	
	const [localBpm, setLocalBPM] = useState(120);
	const [localVolume, setLocalVolume] = useState(100);

	useEffect(() => {
		if (bpm) {
			setLocalBPM(bpm);
		}
	}, [bpm]);

	useEffect(() => {
		if (volume) {
			setLocalVolume(volume);
		}
	}, [volume]);

	const handleBpmChange = evt => {
		setLocalBPM(evt.target.value)
	};

	const handleVolumeChange = evt => {
		setLocalVolume(evt.target.value)
	};

	return (
		<div className="options">
			<Grid columns={"2.5rem 5rem 10rem 12rem"} gap="6rem">
				<Cell>
					<Grid columns={"2.5rem 2.5rem"} gap="1rem">
						<Cell>
							<button onClick={updatePlayback}>{playbackButtonText}</button>
						</Cell>
						<Cell>
							<button onClick={updatePlayback}>Stop</button>
						</Cell>
					</Grid>
				</Cell>
				<Cell>
					<Grid columns={2}>
						<Cell>
							<label htmlFor="keyCenter">Key:</label>
						</Cell>
						<Cell>
							<select
								name="keyCenter"
								value={keyCenter}
								onChange={evt => keyChanged(evt.target.value)}
							>
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
							<label htmlFor="bpm">BPM: {localBpm}</label>
						</Cell>
						<Cell>
							<input
								name="bpm"
								type="range"
								value={localBpm}
								min="60" max="200"
								onChange={handleBpmChange}
								onMouseUp={evt => bpmChanged(evt.target.value)}
							/>
						</Cell>
					</Grid>
				</Cell>
				<Cell>
					<Grid columns={2}>
						<Cell>
							<label htmlFor="volume">Volume: {localVolume}</label>
						</Cell>
						<Cell>
							<input
								name="volume"
								type="range"
								value={localVolume}
								min="0"
								max="100"
								onChange={handleVolumeChange}
								onMouseUp={evt => volChanged(evt.target.value)}
							/>
						</Cell>
					</Grid>
				</Cell>
			</Grid>
		</div>
	);
};

export default OptionsManager;