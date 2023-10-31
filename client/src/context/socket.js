import io from "socket.io-client"
// const Endpoint = "https://mern-chat-app.up.railway.app/"
const Endpoint = "http://localhost:5000"
const socket = io(Endpoint);

export default socket;

