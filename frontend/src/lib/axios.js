import axios from "axios"


//creating axios instance

export default axios.create({
  baseURL: import.meta.env.MODE ==="development" ? "http://localhost:5001/api":"/api",
  withCredentials: true,
})