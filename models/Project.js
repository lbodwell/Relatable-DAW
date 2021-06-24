const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true	
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	viewers: {
		type: [Schema.Types.ObjectId],
		ref: "User",
		required: true,
		default: []
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
	tempo: {
		type: Number,
		required: true,
		default: 120
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

module.exports = mongoose.model("Project", UserSchema);