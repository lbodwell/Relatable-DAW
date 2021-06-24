const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const setupPassport = () => {
	const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
	const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((obj, done) => done(null, obj));

	passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: "localhost:5000/auth/google/callback"
	}, (accessToken, refreshToken, profile, done) => process.nextTick(() => {
		done(null, profile);
	})));
};

const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).redirect("/login");
};

const getUsername = req => {
	return req.user.name.givenName.toLowerCase() + req.user.name.familyName.toLowerCase();
};

module.exports = {setupPassport, ensureAuthenticated, getUsername};