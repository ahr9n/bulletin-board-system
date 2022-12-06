import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8000";

export const AxiosInstance = axios.create({
  baseURL: API_SERVER_ADDRESS,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});
