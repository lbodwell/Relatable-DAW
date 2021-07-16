import io from "socket.io-client";

const socket = io("https://0.0.0.0:5000");

export default socket;