// axios client + API functions

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://jsonplaceholder.typicode.com",
});

export const getUsers = () => api.get("/users").then((res) => res.data);
export const getUserById = (id: number) =>
  api.get(`/users/${id}`).then((res) => res.data);

export default api;
