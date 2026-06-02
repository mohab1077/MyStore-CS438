import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [storeID, setStoreIDState] = useState<string | null>(() => {
    return localStorage.getItem("storeID");
  });

  const [storeName , setstoreName] = useState<string | null>(() => {
    return localStorage.getItem("storeName");
  })

   const [websiteId , setwebsiteId] = useState<string | null>(() => {
    return localStorage.getItem("websiteId");
  })

  const [logo , setlogo] = useState<string | null>(() => {
    return localStorage.getItem("logo");
  })

  const isAuthenticated = Boolean(token);
  const isAuthenticatedStroe = Boolean(storeID);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("storeID");
    setToken(null);
    setStoreIDState(null);
  };

  const setStoreID = (id: string) => {
    localStorage.setItem("storeID", id);
    setStoreIDState(id);
  };
  const setShopInfo =(name:string , id:string , logo:string)=>{
    localStorage.setItem("storeName", name);
    setstoreName(name);
    localStorage.setItem("websiteId", id);
    setwebsiteId(id);
    localStorage.setItem("logo", logo);
    setlogo(logo)

  }

  return (
    <AuthContext.Provider
      value={{
        token,
        storeName,
        websiteId,
        storeID,
        logo,
        isAuthenticated,
        isAuthenticatedStroe,
        login,
        logout,
        setStoreID,
        setShopInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}