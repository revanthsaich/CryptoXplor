import axios from 'axios';

const API_URL = 'https://crypto-xplor.vercel.app/';

// Create a simple API instance without authentication
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
