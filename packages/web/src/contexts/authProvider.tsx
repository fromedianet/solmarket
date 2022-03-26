import { useLocalStorage } from '@oyster/common';
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthConfig {
  authToken: string;
  isAdmin: boolean;
  setAuthToken: (token: string, isAdmin: boolean) => void;
  removeAuthToken: () => void;
}

export const AuthContext = createContext<AuthConfig>(null!);

const AUTH_TOKEN = 'auth-token';
const DELIMITER = '*?:?*';

export const AuthProvider: FC = ({ children }) => {
  const [token, setToken] = useState('');
  const [admin, setAdmin] = useState(false);
  const localStorage = useLocalStorage();

  useEffect(() => {
    const data = localStorage.getItem(AUTH_TOKEN);
    if (data) {
      const splits = data.split(DELIMITER);
      setToken(splits[0]);
      if (splits[1]) {
        setAdmin(splits[1] === 'true');
      }
    }
  }, []);

  const setAuthToken = (newToken: string, isAdmin: boolean) => {
    const data = newToken + DELIMITER + (isAdmin ? 'true' : 'false');
    const saved = localStorage.setItem(AUTH_TOKEN, data);
    if (saved) {
      setToken(newToken);
      setAdmin(isAdmin);
    }
  };

  const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN);
    setToken('');
    setAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authToken: token,
        isAdmin: admin,
        setAuthToken,
        removeAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthToken = () => {
  return useContext(AuthContext);
};
