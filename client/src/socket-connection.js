import io from "socket.io-client";

const socket = io("https://relatable-daw.com:5000");

export default socket;