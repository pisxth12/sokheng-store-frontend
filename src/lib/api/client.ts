import { API } from "@/lib/config/constants";
import axios, { AxiosError, AxiosInstance } from "axios";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API.FULL_URL,
  withCredentials: true,  
  headers: {
    "Content-Type": "application/json",
  },
});


// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log(" Unauthorized - redirecting to login");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;