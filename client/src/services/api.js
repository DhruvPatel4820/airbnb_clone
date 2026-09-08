import axios from "axios";

const api = axios.create({
  // Production URL (Render):
  baseURL: "https://airbnb-clone-hfdu.onrender.com/api/v1",

  // Local Development URL:
  // baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default api;
