import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

/**
 * Test that NestJS ConfigModule can read DATABASE_URL from root .env
 * This simulates how the calendar-service app.module.ts loads the config
 */
async function testNestjsConfig(): Promise<void> {
  console.log('🔍 Testing NestJS ConfigModule with root .env...\n');

  // Simulate the same configuration as app.module.ts
  const configModule = ConfigModule.forRoot({
    isGlobal: true,
    // Load .env from root directory (two levels up from dist/src/app.module.js)
    // When running from source, __dirname will be calendar-service/src
    // When running from dist, __dirname will be calendar-service/dist/src
    // So we need to go up to root: ../../ from src, or ../../../ from dist/src
    envFilePath: path.resolve(process.cwd(), '.env'),
  });

  // Create a test module to verify it works
  try {
    // Import NestJS testing utilities
    const { Test } = await import('@nestjs/testing');
    const nestConfig = await import('@nestjs/config');

    const moduleRef = await Test.createTestingModule({
      imports: [configModule],
    }).compile();

    const configService = moduleRef.get(nestConfig.ConfigService);
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      console.error('❌ ERROR: DATABASE_URL not found by ConfigService');
      console.error('   ConfigModule could not read from root .env file');
      process.exit(1);
    }

    console.log('✅ ConfigService successfully read DATABASE_URL');
    console.log(`   Value: ${maskConnectionString(databaseUrl)}\n`);

    // Check other vars
    const dbMaxConnections = configService.get<number>(
      'DB_MAX_CONNECTIONS',
      10
    );
    const dbIdleTimeout = configService.get<number>('DB_IDLE_TIMEOUT', 20);
    const dbConnectTimeout = configService.get<number>(
      'DB_CONNECT_TIMEOUT',
      10
    );

    console.log('Database configuration from ConfigService:');
    console.log(`  DB_MAX_CONNECTIONS: ${dbMaxConnections}`);
    console.log(`  DB_IDLE_TIMEOUT: ${dbIdleTimeout}`);
    console.log(`  DB_CONNECT_TIMEOUT: ${dbConnectTimeout}\n`);

    console.log('✅ NestJS ConfigModule test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR: Failed to test ConfigModule');
    console.error(
      'Error details:',
      error instanceof Error ? error.message : error
    );
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

/**
 * Safely logs connection string without exposing password.
 */
function maskConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    if (url.password) {
      url.password = '***';
    }
    return url.toString();
  } catch {
    // If parsing fails, just show first and last 10 chars
    if (connectionString.length > 20) {
      return `${connectionString.substring(
        0,
        10
      )}...${connectionString.substring(connectionString.length - 10)}`;
    }
    return '***';
  }
}

// Run the test
// eslint-disable-next-line @typescript-eslint/no-floating-promises
testNestjsConfig();
