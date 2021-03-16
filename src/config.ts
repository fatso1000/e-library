export const ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;

export const DB = {
  NAME: process.env.DB_NAME || "",
  HOST: process.env.DB_HOST || "",
  PORT: process.env.DB_PORT || "",
  USER: process.env.DB_USER || "",
  PASSWORD: process.env.DB_PASSWORD || "",
};

export const CORS_URL = process.env.CORS_URL;

export const TOKEN_INFO = {
  accessTokenValidityDays: parseInt(
    process.env.ACCESS_TOKEN_VALIDITY_SEC || "0"
  ),
  refreshTokenValidityDays: parseInt(
    process.env.REFRESH_TOKEN_VALIDITY_SEC || "0"
  ),
  issuer: process.env.TOKEN_ISSUER || "",
  audience: process.env.TOKEN_AUDIENCE || "",
};

export const LOG_DIRECTORY = process.env.LOG_DIR;
