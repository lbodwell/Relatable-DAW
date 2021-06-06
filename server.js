const fs = require("fs");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const methodOverride = require("method-override");

const app = express();

// Configure environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

// Set up access logging
if (NODE_ENV === "development") {
	app.use(morgan("dev"));
} else if (NODE_ENV === "production") {
	app.use(morgan("common", {
		skip: (req, res) => res.statusCode < 400,
		stream: fs.createWriteStream(path.join(__dirname, "access.log"), {flags: "a"})
	}));
}

// Middleware processing
app.use(helmet({
	contentSecurityPolicy: false
}));
app.use(compression());
app.use(express.json());
app.use(methodOverride());

// Routing
// [API routes go here]
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
	if (NODE_ENV === "production") {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	} else {
		res.status(404).send("Error 404. Not found.");
	}
});

// Start server
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));