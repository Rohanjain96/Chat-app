import io from "socket.io-client"
const Endpoint = "https://mern-chat-app.up.railway.app/"
const socket = io(Endpoint);

export default socket;

