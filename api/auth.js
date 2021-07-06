const express = require("express");
const dotenv = require("dotenv");
const {OAuth2Client} = require("google-auth-library");

const User = require("../models/User");

// TODO: encapsulate env vars in own module to be accessed anywhere
dotenv.config();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const router = express.Router();
const client = new OAuth2Client(CLIENT_ID);

// ! Session cookies don't seem to be persisting
const ensureAuthenticated = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.userId);
		req.user = user;
	} catch (err) {
		console.error(err);
	}

	next();
};

router.post("/google", async (req, res) => {
	const {token} = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: CLIENT_ID
		});
	
		const {name, email, picture} = ticket.getPayload();
	
		const user = await User.findOneAndUpdate({email}, {name, picture}, {new: true, upsert: true});
		
		req.session.userId = user._id;

		res.status(201).json(user);
	} catch (err) {
		// Report errors
		console.log(err);
		res.status(500).json({success: false, error: err});
	}
});

router.delete("/google/logout", ensureAuthenticated, async (req, res) => {
	await req.session.destroy();

	res.status(200).json({
		message: "Logged out successfully"
	});
})

module.exports = {router, ensureAuthenticated};