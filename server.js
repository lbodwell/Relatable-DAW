const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const morgan = require("morgan");
//const cors = require("cors");
const session = require("express-session");
const compression = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");

const {
	PORT,
	NODE_ENV,
	//FRONTEND_APP_URL,
	SESSION_SECRET,
	MONGO_URI
} = require("./config/env-handler");
const apiRouter = require("./routes/api-router");

const app = express();
const server = http.createServer(app);

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
// app.use(cors({
// 	credentials: true,
// 	origin: FRONTEND_APP_URL,
// }));
app.use(helmet({
	contentSecurityPolicy: false
}));
app.use(session({
	secret: SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	// ! This is needed to prevent cookie issues but causes API routes to fail
	// cookie: {
	// 	sameSite: NODE_ENV === "production" ? "none" : "lax",
	// 	secure: NODE_ENV === "production"
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
		origin: "http://67.205.185.42:5000/",
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

	socket.on("noteDeleted", ({username, projectId, deletedNote}) => {
		if (NODE_ENV === "development") {
			console.log(`${username} has deleted a note in project id: ${projectId}.`);
		}
		socket.to(projectId).emit("noteDeleted", {username, deletedNote});
	});

	socket.on("notesCleared", ({username, projectId}) => {
		if (NODE_ENV === "development") {
			console.log(`${username} has cleared the notes in project id: ${projectId}.`);
		}
		socket.to(projectId).emit("notesCleared", {username});
	});

	socket.on("nameChanged", ({username, projectId, name}) => {
		if (NODE_ENV === "development") {
			console.log(`${username} has updated project name in project id: ${projectId}.`);
		}
		socket.to(projectId).emit("nameChanged", {username, name});
	});

	socket.on("keyChanged", ({username, projectId, keyCenter}) => {
		if (NODE_ENV === "development") {
			console.log(`${username} has updated project name in project id: ${projectId}.`);
		}
		socket.to(projectId).emit("keyChanged", {username, keyCenter});
	});

	socket.on("bpmChanged", ({username, projectId, bpm}) => {
		if (NODE_ENV === "development") {
			console.log(`${username} has updated the BPM in project id: ${projectId}.`);
		}
		socket.to(projectId).emit("bpmChanged", {username, bpm});
	});

	socket.on("volChanged", ({username, projectId, volume}) => {
		if (NODE_ENV === "development") {
			console.log(`${username} has updated the volume in project id: ${projectId}.`);
		}
		socket.to(projectId).emit("volChanged", {username, volume});
	});
});

// Start server
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));