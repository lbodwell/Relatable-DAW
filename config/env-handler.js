const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

module.exports = {
	PORT,
	NODE_ENV,
	FRONTEND_APP_URL,
	SESSION_SECRET,
	MONGO_URI,
	GOOGLE_CLIENT_ID
};