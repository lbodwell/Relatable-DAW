import io from "socket.io-client";

// Production
const socket = io.connect();

// Dev
// const socket = io("http://localhost:5000");

export default socket;