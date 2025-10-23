const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = isProduction 
  ? ''  // In production, API is served from the same domain
  : 'http://localhost:3001';  // In development, use the backend server URL

export default {
  API_BASE_URL
};
