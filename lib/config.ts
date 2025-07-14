// Environment configuration
interface Config {
  apiUrl: string;
}

// API URL configuration
// IMPORTANT: Update this URL when deploying to production
// For local development: http://localhost:5000/api
// For production: https://your-backend-domain.onrender.com/api
const config: Config = {
  apiUrl: 'https://notes-backend-3t2c.onrender.com/', // 👈 CHANGE THIS FOR PRODUCTION
};

export default config;
