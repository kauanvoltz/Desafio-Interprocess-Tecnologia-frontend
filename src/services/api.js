import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
    headers: {
        "x-api-key": import.meta.env.VITE_API_KEY || "test",
        "Content-Type": "application/json",
    },
});

export default api;
