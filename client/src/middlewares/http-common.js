import axios from "axios";

// const BASE_URL = `${process.env.REACT_APP_SERVER_IP_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}/api/v1`;
const BASE_URL = `http://127.0.0.1:5500/api/v1`;

export default axios.create({ baseURL: BASE_URL });
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
