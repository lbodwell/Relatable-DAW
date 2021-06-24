const express = require("express");

const User = require("../../models/User");
const passportConfig = require("../../config/passport-config");

const router = express.Router();
const {ensureAuthenticated, getUsername} = passportConfig;

/*
 * Route: /api/users
 * Method: GET
 * Auth: Required
 * Desc: Gets the current user based on the session.
 */
router.get("/", ensureAuthenticated, async (req, res) => {
	// Gather request parameters
	const username = getUsername(req);

	try {
		// Find the user with the given username
		const user = await User.findOne({username});

		// Send result
		res.status(200).json({success: true, data: user});
	} catch (err) {
		// Report errors
		res.status(500).json({success: false, error: err});
	}
});

/*
 * Route: /api/users/all
 * Method: GET
 * Auth: Not required
 * Desc: Gets all users.
 */
router.get("/all", async (req, res) => {
	try {
		// Finds all registered users
		const users = await User.find({});

		// Send result
		res.status(200).json({success: true, data: users});
	} catch (err) {
		// Report errors
		res.status(500).json({success: false, error: err});
	}
});

/*
 * Route: /api/users/:id
 * Method: GET
 * Auth: Not required
 * Desc: Gets the user with the given id.
 */
router.get("/:id", async (req, res) => {
	// Gather request parameters
	const userId = req.params.id;

	try {
		// Find the user with the given id
		const user = await User.findOne({_id: userId});

		// Send result
		res.status(200).json({success: true, data: user});
	} catch (err) {
		// Report errors
		console.log(err)
		res.status(500).json({success: false, error: err});
	}
});

/*
 * Route: /api/users
 * Method: POST
 * Auth: Required
 * Desc: Adds a new user with the display name and username determined by the session.
 */
router.post("/", ensureAuthenticated, async (req, res) => {
	// Gather request parameters
	const username = getUsername(req);
	const {displayName} = req.user;

	try {
		// Create a new user with the given username and display name
		const newUser = await new User({username, displayName}).save();

		// Send result
		res.status(201).json({success: true, data: newUser});
	} catch (err) {
		// Report errors
		res.status(500).json({success: false, error: err});
	}
});

/*
 * Route: /api/users/
 * Method: DELETE
 * Auth: Required
 * Desc: Deletes the current user determined by the session.
 */
router.delete("/", ensureAuthenticated, async (req, res) => {
	// Gather request parameters
	const username = getUsername(req);

	try {
		// Find and delete the user with the given username
		await User.findOneAndDelete({username});

		// Send result
		res.status(204).json({success: true});
	} catch (err) {
		// Report errors
		res.status(500).json({success: false, error: err});
	}
});

module.exports = {router};