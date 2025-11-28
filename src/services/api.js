import axios from "axios";

const backend =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/i, '') : 'http://localhost:5000');

const api = axios.create({
  baseURL: `${backend}/api`,
  withCredentials: true,
});


api.defaults.params = {};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) 
    return Promise.reject(error);
  }
);

export default api;
