"use client";
import { useContext, useState, useEffet, createContext } from "react";

export const UserContext = createContext({
  setUser: () => {},
  currentUser: null,
});

export default function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffet(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const setUser = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem("user", user);
  };

  return (
    <UserContext.Provider value={{ setUser, currentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  return useContext(UserContext);
};
