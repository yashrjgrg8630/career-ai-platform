import axios from "axios";
import { useAuthStore } from "@/store/auth";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://career-ai-platform-1.onrender.com/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("API Request:", config.method?.toUpperCase(), config.url, {
            hasToken: !!token,
            tokenPreview: token ? token.substring(0, 20) + "..." : "none"
        });
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log("✓ API Success:", response.status, response.config.url);
        return response;
    },
    (error) => {
        // Extract detailed error information
        const errorInfo = {
            message: error.message || "Unknown error occurred",
            status: error.response?.status || "No status",
            statusText: error.response?.statusText || "No status text",
            data: error.response?.data || {},
            url: error.config?.url || "Unknown URL",
            method: error.config?.method?.toUpperCase() || "Unknown method",
        };

        console.error("✗ API Error:", errorInfo);

        // Handle authentication errors (401 or 403)
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn("🔒 Authentication failed - Token is invalid or expired");
            console.warn("Clearing auth state and redirecting to login...");

            const authStore = useAuthStore.getState();
            authStore.logout();

            // Only redirect if not already on auth pages
            const currentPath = window.location.pathname;
            if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
                setTimeout(() => {
                    window.location.href = "/login?error=session_expired";
                }, 100);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
