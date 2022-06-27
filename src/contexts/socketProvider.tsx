import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { APIS } from "../constants/apis";

interface SocketConfig {
  socket: Socket;
}
const SocketContext = createContext<SocketConfig>(null!);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(APIS.socket_url);
    // @ts-ignore
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [setSocket]);

  return (
    <SocketContext.Provider value={{ socket: socket! }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(SocketContext);
};
