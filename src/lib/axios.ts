import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://pokeapi.co/api/v2",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
