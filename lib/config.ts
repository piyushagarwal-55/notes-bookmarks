// Environment configuration
interface Config {
  apiUrl: string;
}

// API URL configuration for production deployment
const config: Config = {
  apiUrl: 'https://notes-backend-3t2c.onrender.com/api',
};

export default config;
