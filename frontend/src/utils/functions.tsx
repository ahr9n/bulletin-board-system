import axios from "axios";

const { REACT_APP_SERVER_ADDRESS } = process.env;

export const AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});
