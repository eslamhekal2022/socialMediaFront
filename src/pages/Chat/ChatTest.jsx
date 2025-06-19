import { useEffect } from "react";
import { useSocket } from "../../context/socketContext.jsx";

const ChatTest = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", { roomId: "testRoom" });

    socket.on("message", (msg) => {
      console.log("New Message:", msg);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  return <div>📡 Socket Ready</div>;
};

export default ChatTest;
