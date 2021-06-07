import {transpose} from "@tonaljs/note";

const getPitches = (noteSequence, key) => {
	let pitches = [];

	noteSequence.forEach(note => {
		let pitch;
		const {relation} = note;
		if (relation.parent === -1) {
			pitch = transpose(key + "4", relation.interval);
		} else {
			pitch = transpose(pitches[relation.parent], relation.interval);
		}
		pitches.push(pitch);
	});

	return pitches;
};

export {getPitches};