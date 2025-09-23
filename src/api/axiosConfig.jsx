import axios from 'axios';

// Create a custom Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000, // Optional: Set a request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;