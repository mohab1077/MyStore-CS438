import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  
});
console.log(import.meta.env.VITE_API_URL)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  console.log(import.meta.env.VITE_API_URL)


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});