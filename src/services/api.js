import axios from "axios";

const backend =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/i, '') : 'http://localhost:5000');

const api = axios.create({
  baseURL: `${backend}/api`,
  // Ensure cookies (session) are sent with requests so backend can read connect.sid
  withCredentials: true,
});

// Prevent browser 304 empty bodies by cache-busting GET requests
api.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() === 'get') {
    const params = new URLSearchParams(config.params || {})
    params.set('_t', String(Date.now()))
    config.params = Object.fromEntries(params)
    // Also disable cache explicitly
    config.headers = { ...(config.headers || {}), 'Cache-Control': 'no-cache' }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Do not auto-redirect; let UI decide
    }
    return Promise.reject(error);
  }
);

export default api;
