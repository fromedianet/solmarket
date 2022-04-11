import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { APIS } from '../constants/apis';

interface SocketConfig {
  socket: Socket;
}
const SocketContext = createContext<SocketConfig>(null!);

export const SocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const sk = io(APIS.socket_url);
    setSocket(sk);
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket! }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
