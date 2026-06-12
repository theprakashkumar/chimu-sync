/**
 * Retrieves an environment variable value by its key.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @param {string} [defaultValue=""] - An optional default value to return if the environment variable is not set.
 * @returns {string} The value of the environment variable, or the default value if provided and the variable is not set.
 * @throws {Error} Throws an error if the variable is not set and no default value is provided.
 *
 * @example
 * // Assuming process.env.PORT = '8080'
 * const port = getEnv('PORT'); // returns '8080'
 *
 * // If process.env.NODE_ENV is undefined
 * const env = getEnv('NODE_ENV', 'development'); // returns 'development'
 *
 * // Throws an error if the variable is not set and default is not provided
 * const secret = getEnv('SESSION_SECRET'); // throws Error
 */
export const getEnv = (key: string, defaultValue: string = "") => {
  const val = process.env[key];
  if (val === undefined) {
    if (defaultValue) return defaultValue;
    throw new Error(`Environment variable is not defined with key ${key}!`);
  }
  return val;
};
