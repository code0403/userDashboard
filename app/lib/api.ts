import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://jsonplaceholder.typicode.com",
});


export const getUsers = async () => {
  const res = await api.get("/users");
  // console.log("Fetched users:", res.data);
  return res.data;
};

export const getUserById = async (id: string | number) => {
  const res = await api.get(`/users/${id}`);
  // console.log(`Fetched user ${id}:`, res.data);
  return res.data;
}


export default api;
