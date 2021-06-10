const KeyManager = props => {
	const keys = ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"];

	return (
		<div>
			<label htmlFor="key"></label>
			<select name="key" onChange={evt => props.keyChanged(evt.target.value)}>
				{keys.map((key, index) => (
					<option key={index} value={key}>{`${key} Major`}</option>
				))}
			</select>
		</div>
	);
};

export default KeyManager;