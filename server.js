const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const compression = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const apiRouter = require("./routes/api-router");

const app = express();
const server = http.createServer(app);

// Configure environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// Connect to database
try {
	mongoose.connect(MONGO_URI, {
		useNewUrlParser: true, 
		useUnifiedTopology: true,
		useFindAndModify: false
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
app.use(cors({
	credentials: true,
	origin: FRONTEND_APP_URL,
}));
app.use(helmet({
	contentSecurityPolicy: false
}));
app.use(session({
	secret: SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	// ! This is needed to prevent cookie issues but causes API routes to fail
	// cookie: {
	// 	sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	// 	secure: process.env.NODE_ENV === "production"
	// }
}));
app.use(compression());
app.use(express.json());
app.use(methodOverride());

// Routing
app.use("/api", apiRouter.router);
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static("public"));

app.get("*", (req, res) => {
	if (NODE_ENV === "production") {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	} else {
		res.send("Error 404");
	}
});

// Handle web sockets
const io = socketio(server, {
	cors: {
		origin: FRONTEND_APP_URL,
		methods: ["GET", "POST"]
	}
});

io.on("connection", socket => {
	socket.on("join", ({username, projectId}) => {
		// TODO: Add error handling for joining project
		socket.join(projectId);
		if (NODE_ENV === "development") {
			console.log(`${username} has connected to project id: ${projectId}`);
		}
		socket.to(projectId).emit("connection", `${username} has connected to the project.`);
	});

	socket.on("noteEdited", ({username, projectId, newNote}) => {
		if (NODE_ENV === "development") {
			console.log(`${username} has edited a note in project id: ${projectId}.`);
		}
		socket.to(projectId).emit("noteEdited", {username, newNote});
	});
});

// Start server
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));