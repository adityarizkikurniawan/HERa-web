
import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    return JSON.parse(
      sessionStorage.getItem("hera_demo_user") || "null"
    );
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = (account) => {
    const loggedInUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    };

    sessionStorage.setItem(
      "hera_demo_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
  };

  const logout = () => {
    sessionStorage.removeItem("hera_demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus berada di dalam AuthProvider");
  }

  return context;
}
