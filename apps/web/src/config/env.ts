



/**
 * Check th env file at startup
 */

const requiredEnv = [
  'VITE_API_URL',
  'VITE_APP_NAME',
  'VITE_APP_ENV',
] as const;

const missing = requiredEnv.filter((key) => {
  const value = import.meta.env[key];


  return value === undefined || value.trim() === '';
});

if (missing.length > 0) {
  throw new Error(`Missing env: ${missing.join(', ')}`);
}
  
const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  appEnv: import.meta.env.VITE_APP_ENV,
}; 

export default env;