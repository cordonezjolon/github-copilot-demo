/**
 * Doppler Integration Demonstration
 * 
 * This script demonstrates how the Doppler integration works
 * and shows the graceful fallback to environment variables.
 */

import { dopplerClient } from '../src/config/doppler';
import { config, configPromise } from '../src/config/env';

async function demonstrateDopplerIntegration() {
  console.log('🔐 Doppler Integration Demonstration\n');
  console.log('=' .repeat(50));
  
  // Check if Doppler is enabled
  console.log('\n1. Checking Doppler Status:');
  console.log(`   Doppler Enabled: ${dopplerClient.isEnabled()}`);
  
  if (dopplerClient.isEnabled()) {
    console.log('   ✅ Doppler is active and will be used for secrets');
  } else {
    console.log('   ℹ️  Doppler is disabled, using environment variables');
  }
  
  // Show configuration loading
  console.log('\n2. Configuration Loading:');
  console.log('   Loading configuration...');
  const loadedConfig = await configPromise;
  
  console.log(`   ✅ Configuration loaded successfully`);
  console.log(`   Environment: ${loadedConfig.NODE_ENV}`);
  console.log(`   Port: ${loadedConfig.PORT}`);
  console.log(`   Database: ${loadedConfig.DB_DIALECT}`);
  console.log(`   Log Level: ${loadedConfig.LOG_LEVEL}`);
  
  // Show synchronous config (backward compatibility)
  console.log('\n3. Backward Compatibility:');
  console.log('   Synchronous config (no Doppler):');
  console.log(`   Environment: ${config.NODE_ENV}`);
  console.log(`   Port: ${config.PORT}`);
  
  // Configuration priority demonstration
  console.log('\n4. Configuration Priority:');
  console.log('   The application loads config in this order:');
  console.log('   1. Doppler secrets (if enabled)');
  console.log('   2. Environment variables (process.env)');
  console.log('   3. Default values (from Zod schemas)');
  
  // Test secret fetching (if Doppler is enabled)
  if (dopplerClient.isEnabled()) {
    console.log('\n5. Testing Doppler Secret Fetch:');
    try {
      const testSecret = await dopplerClient.getSecret('NODE_ENV');
      console.log(`   ✅ Successfully fetched NODE_ENV: ${testSecret || 'undefined'}`);
    } catch (error) {
      console.log(`   ⚠️  Failed to fetch secret:`, error);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n✨ Demonstration complete!\n');
  
  // Usage examples
  console.log('Usage Examples:');
  console.log('\n  With Doppler CLI:');
  console.log('  $ doppler run -- ts-node examples/doppler-demo.ts');
  
  console.log('\n  With Service Token (.env):');
  console.log('  DOPPLER_ENABLED=true');
  console.log('  DOPPLER_TOKEN=<your-doppler-service-token>');
  console.log('  $ ts-node examples/doppler-demo.ts');
  
  console.log('\n  Without Doppler (default):');
  console.log('  $ ts-node examples/doppler-demo.ts');
  console.log('');
}

// Run the demonstration
demonstrateDopplerIntegration().catch((error) => {
  console.error('❌ Error running demonstration:', error);
  process.exit(1);
});
