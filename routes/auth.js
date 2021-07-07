const express = require("express");
const dotenv = require("dotenv");
const {OAuth2Client} = require("google-auth-library");

const {getUser, addOrUpdateUser} = require("../controllers/user-controller");

// TODO: encapsulate env vars in own module to be accessed anywhere
dotenv.config();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const router = express.Router();
const client = new OAuth2Client(CLIENT_ID);

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
			audience: CLIENT_ID
		});

		const {name, email, picture} = ticket.getPayload();
		const filter = {email};
		const update = {name, picture};
		
		const user = await addOrUpdateUser(filter, update);
		req.session.userId = user._id;

		res.status(201).json(user);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.delete("/google/logout", ensureAuthenticated, (req, res) => {
	req.session.destroy();

	res.status(200).json({message: "Logged out successfully"});
})

module.exports = {router, ensureAuthenticated};