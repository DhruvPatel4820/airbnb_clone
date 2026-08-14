import axios from "axios";

const api = axios.create({
  baseURL: "https://airbnb-clone-hfdu.onrender.com/api/v1",
  withCredentials: true,
});

export default api;