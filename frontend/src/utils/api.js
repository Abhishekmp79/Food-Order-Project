import axios from "axios";
import qs from "qs";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

// 🔑 Attach the saved login token to EVERY request.
// Works on all devices — no cross-origin cookie problems.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

export default api;