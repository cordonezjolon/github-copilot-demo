# Examples

This directory contains example scripts demonstrating various features of the application.

## Doppler Integration Demo

The `doppler-demo.ts` script demonstrates the Doppler secrets management integration.

### Running the Demo

**Without Doppler (default):**
```bash
npx ts-node examples/doppler-demo.ts
```

**With Doppler CLI:**
```bash
# After setting up Doppler with `doppler setup`
doppler run -- npx ts-node examples/doppler-demo.ts
```

**With Doppler Service Token:**
```bash
# Set environment variables first
export DOPPLER_ENABLED=true
export DOPPLER_TOKEN=<your-doppler-service-token>
export DOPPLER_PROJECT=<your-project>
export DOPPLER_CONFIG=<your-config>

npx ts-node examples/doppler-demo.ts
```

### What the Demo Shows

1. ✅ Doppler status (enabled/disabled)
2. ✅ Configuration loading from Doppler or environment
3. ✅ Backward compatibility with process.env
4. ✅ Configuration priority and fallback mechanism
5. ✅ Secret fetching demonstration (if Doppler is enabled)

### Expected Output

The demo will display:
- Current Doppler integration status
- Loaded configuration values
- Configuration priority explanation
- Usage examples for different scenarios

### Learning Points

- Doppler is **optional** and disabled by default
- The application works seamlessly with or without Doppler
- Configuration falls back gracefully when Doppler is unavailable
- Existing code continues to work without modifications
