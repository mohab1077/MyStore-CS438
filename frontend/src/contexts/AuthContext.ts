import { createContext, useContext, useState } from "react";

interface AuthContextType {
  storeName:string| null;
  websiteId  :string| null;
  token:string | null;
  storeID: string | null;
  isAuthenticated: boolean;
  isAuthenticatedStroe:boolean;
  login: (token: string) => void;
  logout: () => void;
  setStoreID: (id: string) => void;
  setShopInfo : (name:string , id:string) => void
}

export const AuthContext = createContext<AuthContextType | null>(null);