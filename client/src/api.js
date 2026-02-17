// const BASE_URL = 'https://innovative-staffing-1.onrender.com/api';
import axios from 'axios';
// const BASE_URL = 'http://localhost:5000/api';
const BASE_URL = 'https://innovativesolution-api.onrender.com/api';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export { BASE_URL };
export default api;
