import { getEnv } from "../utils/getEnv";

/**
 * Retrieves and returns application configuration values from environment variables.
 *
 * @returns {{
 *   NODE_ENV: string,
 *   PORT: string,
 *   BASE_PATH: string,
 *   MONGO_URI: string,
 *   GOOGLE_ID: string,
 *   GOOGLE_SECRET: string,
 *   GOOGLE_CALLBACK_URL: string,
 *   FRONTEND_ORIGIN: string,
 *   FRONTEND_GOOGLE_CALLBACK_URL: string,
 *   JWT_SECRET: string,
 *   JWT_EXPIRES_IN: string
 *   JWT_REFRESH_SECRET: string,
 *   JWT_REFRESH_EXPIRES_IN: string,
 * }} An object containing configuration values for the application.
 *
 * @example
 * // Usage:
 * import { appConfig } from './config/appConfig';
 * const port = appConfig.PORT;
 */
const getAppConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "8080"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI"),
  GOOGLE_ID: getEnv("GOOGLE_ID"),
  GOOGLE_SECRET: getEnv("GOOGLE_SECRET"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "3000"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1d"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
});

export const appConfig = getAppConfig();