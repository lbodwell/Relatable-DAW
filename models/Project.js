const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	editors: {
		type: [Schema.Types.ObjectId],
		ref: "User",
		required: true,
		default: []
	},
	noteSequence: {
		type: [Object],
		required: true,
		default: []
	},
	keyCenter: {
		type: String,
		required: true,
		default: "C"
	},
	bpm: {
		type: Number,
		required: true,
		default: 120
	},
	volume: {
		type: Number,
		required: true,
		default: 0
	},
	synth: {
		type: Object,
		required: true,
		default: {
			waveType: "sine"
		}
	},
	effects: {
		type: [Object],
		required: true,
		default: []
	},
	dateCreated: {
		type: Date,
		required: true,
		default: Date.now
	},
	lastEdited: {
		type: Date,
		required: true,
		default: Date.now
	}
});

module.exports = mongoose.model("Project", ProjectSchema);