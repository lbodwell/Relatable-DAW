const express = require("express");

const User = require("../models/User");
const {ensureAuthenticated} = require("./auth");

const router = express.Router();

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
	const {userId} = req.session;

	try {
		// Find and delete the user with the given user id
		await User.findOneAndDelete({_id: userId});

		// Send result
		res.status(204).json({success: true});
	} catch (err) {
		// Report errors
		res.status(500).json({success: false, error: err});
	}
});

module.exports = {router};