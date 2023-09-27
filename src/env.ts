import dotenv from 'dotenv';
import { z } from 'zod';

import { logger } from './logger';

dotenv.config();

const envVariablesSchema = z.object({
  PORT: z.string().regex(/^\d+$/).default('3000'),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  AUTH_URI: z.string().url(),
  TOKEN_URI: z.string().url(),
  USERINFO_URI: z.string().url(),
  // MONGO_URI: z.string().url(),
});

const parsedEnvVariables = envVariablesSchema.safeParse(process.env);

if (parsedEnvVariables.success) {
  process.env = parsedEnvVariables.data;
} else {
  logger.error(parsedEnvVariables.error.errors);

  throw new Error('Invalid environment variables');
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariablesSchema> {}
  }
}
