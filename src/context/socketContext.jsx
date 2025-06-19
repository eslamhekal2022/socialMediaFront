// src/context/socketContext.jsx
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    socket.current = io(`${API}`, {
      withCredentials: true,
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
