import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig)=> {
   // Get token from localStorage
   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
   
   if(token){
    config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
},(error) => {
    return Promise.reject(error);
  });

  // Response interceptor - handle errors
  apiClient.interceptors.response.use((response)=> {
    return response;
  },(error: AxiosError) => {
      if(error.response?.status === 401){
        console.log('🔒 Unauthorized - redirecting to login');
        if(typeof window !== "undefined"){
          window.location.href = "/login";
          localStorage.removeItem("token");
        }
      }
      return Promise.reject(error);
  });
  
  export default apiClient;