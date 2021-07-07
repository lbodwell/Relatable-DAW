const express = require("express");

const {ensureAuthenticated} = require("../auth");
const {getUser, deleteUser} = require("../../controllers/user-controller");

const router = express.Router();

router.get("/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await getUser({_id: userId});

		res.status(200).json(user);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

router.delete("/", ensureAuthenticated, async (req, res) => {
	const {userId} = req.user._id;

	try {
		await deleteUser(userId);

		res.status(204).json({success: true});
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

module.exports = {router};