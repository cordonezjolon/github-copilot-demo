import { z } from 'zod';
import dotenv from 'dotenv';
import { dopplerClient } from './doppler';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432').transform(Number),
  DB_NAME: z.string().default('myapp_dev'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_DIALECT: z.enum(['postgres', 'mysql', 'sqlite']).default('postgres'),
  JWT_SECRET: z.string().default('default-secret-change-in-production'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

async function loadConfig(): Promise<z.infer<typeof envSchema>> {
  let envVars = { ...process.env };

  // If Doppler is enabled, fetch secrets and merge with process.env
  if (dopplerClient.isEnabled()) {
    try {
      const dopplerSecrets = await dopplerClient.getSecrets();
      envVars = { ...envVars, ...dopplerSecrets };
      console.log('✅ Configuration loaded from Doppler');
    } catch (error) {
      console.warn('⚠️ Failed to load from Doppler, falling back to process.env:', error);
    }
  }

  const parsedEnv = envSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
  }

  return parsedEnv.data;
}

// Export config as a promise for async initialization
export const configPromise = loadConfig();

// For backward compatibility, also export a synchronous version
// This will use process.env directly (without Doppler) for sync access
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const config = parsedEnv.data;
