import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8870"
});

export default api;