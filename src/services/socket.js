import { io } from "socket.io-client";

const Api=import.meta.env.VITE_API_URL
const socket = io(`${Api}`, {
  withCredentials: true,
});

export default socket;
