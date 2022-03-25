import { useLocalStorage } from '@oyster/common';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';

interface AuthConfig {
  authToken: string;
  setAuthToken: (string) => void;
  removeAuthToken: () => void;
}

export const AuthContext = createContext<AuthConfig>(null!);

const AUTH_TOKEN = 'auth-token';

export const AuthProvider: FC = ({ children }) => {
  const [token, setToken] = useState('');
  const localStorage = useLocalStorage();

  useEffect(() => {
    setToken(localStorage.getItem(AUTH_TOKEN));
  }, []);

  const setAuthToken = (newToken: string) => {
    const saved = localStorage.setItem(AUTH_TOKEN, newToken);
    if (saved) {
      setToken(newToken);
    }
  };

  const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{
      authToken: token,
      setAuthToken,
      removeAuthToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthToken = () => {
  return useContext(AuthContext);
};
