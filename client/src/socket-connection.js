import io from "socket.io-client";

const socket = io("http://relatable-daw.com:5000");

export default socket;