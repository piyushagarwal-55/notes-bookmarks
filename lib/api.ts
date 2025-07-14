// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // Vercel will handle routing to serverless functions
  : 'http://localhost:5000/api';

export default API_BASE_URL;
