import { getEnv } from "../utils/getEnv";

// On running this function a object will get returned which will have all the values form the ENV file.
const getAppConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "8080"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI"),
  SESSION_SECRET: getEnv("SESSION_SECRET"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),
  GOOGLE_ID: getEnv("GOOGLE_ID"),
  GOOGLE_SECRET: getEnv("GOOGLE_SECRET"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "3000"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
});

export const appConfig = getAppConfig();
// If we need NODE_ENV we can get by appConfig.NODE_ENV;
