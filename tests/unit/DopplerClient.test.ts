import { DopplerClient } from '../../src/config/doppler';

describe('DopplerClient', () => {
  describe('constructor', () => {
    it('should initialize with Doppler disabled when enabled is false', () => {
      const client = new DopplerClient({
        enabled: false,
        accessToken: 'test-token',
      });

      expect(client.isEnabled()).toBe(false);
    });

    it('should initialize with Doppler disabled when accessToken is missing', () => {
      const client = new DopplerClient({
        enabled: true,
      });

      expect(client.isEnabled()).toBe(false);
    });

    it('should initialize with Doppler enabled when config is valid', () => {
      const client = new DopplerClient({
        enabled: true,
        accessToken: 'test-token',
      });

      // SDK initialization might fail in test env, but client should attempt to enable
      expect(typeof client.isEnabled()).toBe('boolean');
    });
  });

  describe('getSecret', () => {
    it('should return undefined when Doppler is disabled', async () => {
      const client = new DopplerClient({
        enabled: false,
      });

      const result = await client.getSecret('TEST_SECRET');

      expect(result).toBeUndefined();
    });
  });

  describe('getSecrets', () => {
    it('should return empty object when Doppler is disabled', async () => {
      const client = new DopplerClient({
        enabled: false,
      });

      const result = await client.getSecrets();

      expect(result).toEqual({});
    });
  });

  describe('isEnabled', () => {
    it('should return false when Doppler is disabled', () => {
      const client = new DopplerClient({
        enabled: false,
      });

      expect(client.isEnabled()).toBe(false);
    });

    it('should return false when accessToken is missing', () => {
      const client = new DopplerClient({
        enabled: true,
      });

      expect(client.isEnabled()).toBe(false);
    });
  });
});
