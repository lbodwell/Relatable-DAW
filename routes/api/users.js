const express = require("express");

const {ensureAuthenticated} = require("../auth-router");
const {getUser, deleteUser} = require("../../controllers/user-controller");

const router = express.Router();

router.get("/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await getUser({_id: userId});

		res.status(200).json(user);
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
});

router.delete("/", ensureAuthenticated, async (req, res) => {
	const userId = req.user._id;

	try {
		const deletedUser = await deleteUser(userId);

		if (deletedUser) {
			res.status(204).send();
		} else {
			res.status(500).send();
		}
		
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
});

module.exports = {router};