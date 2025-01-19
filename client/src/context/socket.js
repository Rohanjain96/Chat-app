import io from "socket.io-client"
const Endpoint = "https://chat-app-lpen.onrender.com/"
// const Endpoint = "http://localhost:5000"
const socket = io(Endpoint);

export default socket;

