const express = require("express");
const passport = require("passport");

const User = require("../../models/User");
const passportConfig = require("../../config/passport-config");

const router = express.Router();
const {getUsername} = passportConfig;

router.get("/login", passport.authenticate("google", {
	scope: ["profile"]
}));

router.get("/callback", passport.authenticate("google", {
	failureRedirect: "/login" 
}), async (req, res) => {
	const username = getUsername(req);
	const {displayName} = req.user;
	
	try {
		const user = await User.findOne({username});
		if (!user) {
			const newUser = new User({username, displayName});
			await newUser.save();
		}
		res.redirect("../../");
	} catch (err) {
		res.status(500).json({success: false, error: err});
	}
});

module.exports = {router};