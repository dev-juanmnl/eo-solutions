import axios from "axios";

const rest = axios.create({
  baseURL: import.meta.env.VITE_DOMAIN_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

export default rest;
