import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN_FR,
  headers: {
    Accept: "application/vnd.api+json",
  },
});

export default api;
