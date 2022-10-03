import io from "socket.io-client"
const Endpoint = "https://mern-chatify123.herokuapp.com"
const socket = io(Endpoint);

export default socket;

