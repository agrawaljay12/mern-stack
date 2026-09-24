const metaEnv = (import.meta as ImportMeta & {
  env: {
    VITE_API_BASE_URL?: string;
    DEV: boolean;
    PROD: boolean;
    MODE: string;
  };
}).env;

const apiBaseUrl = metaEnv.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL environment variable is not configured",
  );
}

const env = {
  apiBaseUrl,
  isDevelopment: metaEnv.DEV,
  isProduction: metaEnv.PROD,
  mode: metaEnv.MODE,
} as const;

export default env;