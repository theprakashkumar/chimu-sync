export const getEnv = (key: string, defaultValue: string = "") => {
  const val = process.env[key];
  if (val === undefined) {
    if (defaultValue) return defaultValue;
    throw new Error(`Environment variable is not defined with key ${key}`);
  }
  return val;
};
