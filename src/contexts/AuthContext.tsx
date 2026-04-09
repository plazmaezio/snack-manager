import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UserRequest, UserResponse } from "../types";
import {
  getCurrentUser,
  loginService,
  logoutService,
  signupService,
} from "../services/authService";

interface AuthContextType {
  user: UserResponse | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: UserRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthContextType["error"]>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    setIsLoading(true);
    getCurrentUser()
      .then((userData: UserResponse) => setUser(userData))
      .catch(() => localStorage.removeItem("jwt")) // token is invalid/expired
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData: UserResponse = await loginService(username, password);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: UserRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await signupService(userData);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};
