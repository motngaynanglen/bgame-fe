"use client";
import { isClient } from "@/src/lib/httpAxios";
import { AccountResType } from "@/src/schemaValidations/account.schema";
import { getCookie } from "cookies-next";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import authApiRequest from "../apiRequests/auth";

type User = AccountResType["data"] | null;

const AppContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
}>({
  user: null,
  setUser: () => { },
  isAuthenticated: false,
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User>(() => getStoredUser());
  const isAuthenticated = Boolean(user);

  const setUser = useCallback((user: User) => {
    setUserState(user);
    setStoredUser(user);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Gọi endpoint proxy trên Next.js FE
        const res = await authApiRequest.me();
        if (!res) {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };
    if (user) {
      checkAuth();
    }
  }, [isAuthenticated, setUser]);
  useEffect(() => {
    // const token = getCookie("sessionToken");
    // if(!token) {
    //   setUser(null);
    // }
    setUserState(getStoredUser());
  }, []);
  // const [user, setUserState] = useState<User | null>(() => {
  //   if (isClient()) {
  //     const _user = localStorage.getItem('user')
  //     return _user ? JSON.parse(_user) : null
  //   }
  //   return null
  // })
  // const setUser = useCallback(
  //   (user: User | null) => {
  //     setUserState(user)
  //     localStorage.setItem('user', JSON.stringify(user))
  //   },
  //   [setUserState]
  // )

  // useEffect(() => {
  //   const _user = localStorage.getItem('user')
  //   setUserState(_user ? JSON.parse(_user) : null)
  // }, [setUserState])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const setStoredUser = (user: User | null) => {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};
