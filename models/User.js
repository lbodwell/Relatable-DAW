const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true	
	},
	name: {
		type: String,
		required: true
	},
	picture: {
		type: String
	}
});

module.exports = mongoose.model("User", UserSchema);