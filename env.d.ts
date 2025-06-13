namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    DATABASE_URL: string;
    IRON_SESSION_PASSWORD: string;
    IRON_SESSION_COOKIE_NAME: string;
    IRON_SESSION_TTL: string;
  }
}
