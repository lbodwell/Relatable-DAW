const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const apiRouter = require("./api/api-router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	// ! Remove for production
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});

// Configure environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
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
	origin: "http://localhost:3000"
}));
app.use(helmet({
	contentSecurityPolicy: false
}));
app.use(session({
	secret: "itsasecret",
	resave: false,
	saveUninitialized: true,
	// ! Uncomment for production over SSL
	// cookie: { secure: true }
}))
app.use(compression());
app.use(express.json());
app.use(cookieParser())
app.use(methodOverride());

// Routing
app.use("/api", apiRouter.router);
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static("public"));

app.get("*", (req, res) => {
	if (NODE_ENV === "production") {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	} else {
		res.send("Application is in development mode. Use the create-react-app dev server to see the frontend.");
	}
});

// Handle web sockets
io.on("connection", socket => {
	socket.on("join", ({user, projectId}) => {
		// TODO: Add error handling for joining project
		socket.join(projectId);
		console.log(`${user} has connected to project id: ${projectId}.`);
		socket.to(projectId).emit("connection", `${user} has connected to the project.`);
	});

	socket.on("disconnect", () => {
		console.log("A user has disconnected.");
	});

	socket.on("noteEdited", ({user, projectId, newNote}) => {
		console.log(`${user} has edited a note in project id: ${projectId}.`);
		socket.to(projectId).emit("noteEdited", {user, newNote});
	});
});

// Start server
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));