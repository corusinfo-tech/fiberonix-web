import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [name, setName] = useState(localStorage.getItem("authName") || null);
 

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  // Sync refresh token to localStorage
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  // Sync name to localStorage
  useEffect(() => {
    if (name) {
      localStorage.setItem("authName", name);
    } else {
      localStorage.removeItem("authName");
    }
  }, [name]);

  

  const login = (accessToken, refreshTokenValue, userName) => {
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setName(userName);
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        name,
        login,
        logout,
        isAuthenticated: !!token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
