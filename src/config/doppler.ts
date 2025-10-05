import { DopplerSDK } from '@dopplerhq/node-sdk';

export interface DopplerConfig {
  enabled: boolean;
  accessToken?: string;
  project?: string;
  config?: string;
}

export class DopplerClient {
  private sdk: DopplerSDK | null = null;
  private enabled: boolean;

  constructor(config: DopplerConfig) {
    this.enabled = config.enabled && !!config.accessToken;

    if (this.enabled && config.accessToken) {
      try {
        this.sdk = new DopplerSDK({
          accessToken: config.accessToken,
        });
        console.log('✅ Doppler SDK initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Doppler SDK:', error);
        this.enabled = false;
      }
    } else {
      console.log('ℹ️ Doppler integration disabled, using environment variables');
    }
  }

  async getSecret(name: string): Promise<string | undefined> {
    if (!this.enabled || !this.sdk) {
      return undefined;
    }

    try {
      const project = process.env.DOPPLER_PROJECT || 'default';
      const config = process.env.DOPPLER_CONFIG || 'dev';

      const response = await this.sdk.secrets.get(project, config, name);

      return response.value?.computed;
    } catch (error) {
      console.warn(`⚠️ Failed to fetch secret "${name}" from Doppler:`, error);
      return undefined;
    }
  }

  async getSecrets(): Promise<Record<string, string>> {
    if (!this.enabled || !this.sdk) {
      return {};
    }

    try {
      const project = process.env.DOPPLER_PROJECT || 'default';
      const config = process.env.DOPPLER_CONFIG || 'dev';

      const response = await this.sdk.secrets.list(project, config);

      const secrets: Record<string, string> = {};
      if (response.secrets) {
        for (const secret of Object.values(response.secrets)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
          if (secret.name && secret.computed?.value) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            secrets[secret.name as string] = secret.computed.value as string;
          }
        }
      }

      return secrets;
    } catch (error) {
      console.error('❌ Failed to fetch secrets from Doppler:', error);
      return {};
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Initialize Doppler client with configuration from environment
export const dopplerClient = new DopplerClient({
  enabled: process.env.DOPPLER_ENABLED === 'true',
  accessToken: process.env.DOPPLER_TOKEN,
  project: process.env.DOPPLER_PROJECT,
  config: process.env.DOPPLER_CONFIG,
});
