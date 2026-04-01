import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../api/axios";
interface AuthUser {
  userId: string;
  userName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  ping: () => void;
  login: (mobileNumber: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication cookie on mount
    const userCookie = Cookies.get("auth");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing auth cookie:", error);
        Cookies.remove("auth");
      }
    }
  }, []);

  const login = async (mobileNumber: string) => {
    // 1.0833 hours = 1 hour and 5 minutes (1 + 5/60)


    // const response = {
    //   status: 200,
    //   data: {
    //     userId: `123${mobileNumber}`,
    //     userName: "John Doe",
    //   },
    // };


    //Seever call

    const response = await api.post(`/login`,{
      phone_number: mobileNumber,
    });

    if (response.status === 200) {
      const userData = response.data;
      Cookies.set("auth", JSON.stringify(userData), {
        expires: (1 / 24) * 1.0833,
        path: '/',
        sameSite: 'strict',
        secure: window.location.protocol === 'https:' // Only set secure flag on HTTPS
      });
      setUser(userData);
      setIsAuthenticated(true);
    }
    else {
      console.error("Error fetching user data:", response.data);
    }
  };

  const ping = async () => {
    const response = await api.get("/ping");
    return response.data;
  };

  const logout = () => {
    Cookies.remove("auth");
    setUser(null);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        ping,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
