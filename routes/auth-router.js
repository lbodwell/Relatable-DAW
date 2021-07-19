const express = require("express");
const {OAuth2Client} = require("google-auth-library");

const {getUser, addOrUpdateUser} = require("../controllers/user-controller");
const {GOOGLE_CLIENT_ID} = require("../config/env-handler");

const router = express.Router();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const ensureAuthenticated = async (req, res, next) => {
	const {userId} = req.session;
	
	try {
		const user = await getUser({_id: userId});
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
			audience: GOOGLE_CLIENT_ID
		});

		const {name, email, picture} = ticket.getPayload();
		const filter = {email};
		const update = {name, picture};
		
		const user = await addOrUpdateUser(filter, update);
		req.session.userId = user._id;

		res.status(201).json(user);
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
});

router.delete("/google/logout", ensureAuthenticated, (req, res) => {
	req.session.destroy();

	res.status(200).json({message: "Logged out successfully"});
})

module.exports = {router, ensureAuthenticated};