// src/axiosInstance.js

import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust based on your API URL
});

// Export the Axios instance
export default axiosInstance;
