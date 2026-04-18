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
 *   JWT_EXPIRES_IN: string,
 *   JWT_REFRESH_SECRET: string,
 *   JWT_REFRESH_EXPIRES_IN: string,
 *   SMTP_USER: string,
 *   SMTP_PASS: string,
 *   MAIL_FROM: string,
 *   MFA_TOKEN_SECRET: string,
 *   MFA_TOKEN_EXPIRES_IN: string,
 * }} 
 **/
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
  SMTP_USER: getEnv("SMTP_USER"),
  SMTP_PASS: getEnv("SMTP_PASS"),
  MAIL_FROM: getEnv("MAIL_FROM"),
  MFA_TOKEN_SECRET: getEnv("MFA_TOKEN_SECRET"),
  MFA_TOKEN_EXPIRES_IN: getEnv("MFA_TOKEN_EXPIRES_IN", "5m"),
});

export const appConfig = getAppConfig();
