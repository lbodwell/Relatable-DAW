 const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");

const passportConfig = require("./config/passport-config");
const googleAuth = require("./routes/auth/google-auth");
const apiRouter = require("./routes/api/api-router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	// ! Remove for production
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	  }
});
const {ensureAuthenticated} = passportConfig;

// Configure environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

// Configure passport sessions
passportConfig.setupPassport();

// Connect to database
try {
	mongoose.connect(MONGO_URI, {
		useNewUrlParser: true, 
		useUnifiedTopology: true
	}).then(() => console.log("Connected to database"));
} catch (err) {
	console.error(err);
}

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
app.use(session({
	secret: "workstationofdigitalaudio",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use("/auth/google", googleAuth.router);
app.use("/api", apiRouter.router);
//app.use(express.static(path.join(__dirname, "client", "build")));

// ! Temporary auth testing routes

app.get("/", ensureAuthenticated, (req, res) => {
	res.send("Home page");
});

app.get("/login", (req, res) => {
	res.send("Please login.");
});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});
app.get("/account", (req, res) => {
	if (req.isAuthenticated()) {
		res.send(`Hello, ${req.user.displayName}!`);
	} else {
		res.send("You are not logged in.");
	}
});

// app.get("/", (req, res) => {
// 	if (NODE_ENV === "production") {
// 		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// 	} else {
// 		res.status(404).send("Error 404. Not found.");
// 	}
// });
app.get("*", (req, res) => {
	res.status(404).send("Error 404. Not found.");
});

// Web socket handling
io.on("connection", socket => {
	console.log("A user has connected");
	socket.broadcast.emit("connection", "A user has connected");

	socket.on("disconnect", () => {
		console.log("A user has disconnected");
		socket.broadcast.emit("disconnection", "A user has disconnected");
	});

	socket.on("noteEdited", message => {
		const {user, projectId, newNote} = message;
		// TODO: use project id to determine which room to emit to
		socket.broadcast.emit("noteEdited", {user, newNote});
	});
});

// Start server
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));