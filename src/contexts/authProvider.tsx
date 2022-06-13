import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../models/user";

interface AuthConfig {
  authToken: string;
  user: User | null;
  setAuthToken: (token: string, user: User) => void;
  removeAuthToken: () => void;
}

export const AuthContext = createContext<AuthConfig>(null!);

const AUTH_TOKEN = "auth-token";
const DELIMITER = "*?:?*";

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const localStorage = useLocalStorage();

  useEffect(() => {
    const data = localStorage.getItem(AUTH_TOKEN);
    if (data) {
      const splits = data.split(DELIMITER);
      setToken(splits[0]);
      if (splits[1]) {
        setUser(JSON.parse(splits[1]));
      }
    }
  }, []);

  const setAuthToken = (newToken: string, user: User) => {
    const data = newToken + DELIMITER + JSON.stringify(user);
    const saved = localStorage.setItem(AUTH_TOKEN, data);
    if (saved) {
      setToken(newToken);
      setUser(user);
    }
  };

  const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN);
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authToken: token,
        user: user,
        setAuthToken,
        removeAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthToken = () => {
  return useContext(AuthContext);
};
