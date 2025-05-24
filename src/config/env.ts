import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { v4 } from 'uuid';

// Define environment type
export type Environment = 'development' | 'staging' | 'production';

// Load the appropriate .env file based on NODE_ENV
export function loadEnv(): void {
  const NODE_ENV = (process.env.NODE_ENV || 'development') as Environment;

  const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
  const defaultEnvPath = path.resolve(process.cwd(), '.env');

  // First try to load environment-specific file
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded environment from ${envPath}`);
  }
  // Fall back to default .env file
  else if (fs.existsSync(defaultEnvPath)) {
    dotenv.config({ path: defaultEnvPath });
    console.log(`Loaded environment from ${defaultEnvPath}`);
  } else {
    console.warn('No .env file found');
  }
}

// Configuration object with typed environment variables
export const config = {
  env: process.env.NODE_ENV || 'development',

  database: {
    URI: process.env.NODE_ENV === 'test'
      ? `mongodb://127.0.0.1:27017/test_${v4()}`
      : process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/maclink-saas',
  },

  logging: {
    ACCESS_TOKEN: process.env.ROLLBAR_ACCESS_TOKEN || '',
  },

  security: {
    maxWrongAttemptsByIpPerDay: 20,
    maxConsecutiveFailsByUsernameAndIp: 10,
    maxWrongAttemptsByUsernamePerDay: 15,
    maxLoginByUsernamePerDay: 15,
    NO_CORS: process.env.NO_CORS || 'true',
    ORIGIN: '',
    WHITELIST: process.env.WHITELIST || '',
  },

  redis: {
    URL: process.env.REDIS_URL || 'redis://127.0.0.1:6349',
  },
};