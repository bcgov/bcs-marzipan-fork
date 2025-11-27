import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as postgresModule from 'postgres';
import * as path from 'path';
import * as fs from 'fs';
// Import schema from built package (packages must be built first)
import { schema } from '@corpcal/database';

// Try to load dotenv if available
let dotenv: typeof import('dotenv') | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  dotenv = require('dotenv');
} catch {
  // dotenv not available, will use environment variables directly
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

async function testDatabaseConnection(): Promise<void> {
  // Load environment variables from .env file if it exists and dotenv is available
  const envPath = path.join(__dirname, '../.env');
  if (dotenv && fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('ERROR: DATABASE_URL environment variable is required.');
    console.error(
      'Please set it in your .env file or as an environment variable.'
    );
    process.exit(1);
  }

  console.log(
    `Connecting to database: ${maskConnectionString(connectionString)}`
  );

  try {
    // Access the default export - when externalized, require() returns the default directly
    // Type assertion needed because postgres module's default export typing varies by build target
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const postgres = (postgresModule as any).default || postgresModule;

    // Create postgres client with connection pooling
    const maxConnections = parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10);
    const idleTimeout = parseInt(process.env.DB_IDLE_TIMEOUT || '20', 10);
    const connectTimeout = parseInt(process.env.DB_CONNECT_TIMEOUT || '10', 10);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const queryClient = postgres(connectionString, {
      max: maxConnections,
      idle_timeout: idleTimeout,
      connect_timeout: connectTimeout,
      connection: {
        application_name: 'calendar-service-test',
      },
    });

    // Create Drizzle client with schema
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const db = drizzle(queryClient, { schema });

    // Test the connection with a simple query
    console.log('📊 Testing database connection...');
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection successful!');
    console.log(`   Query result: ${JSON.stringify(result)}`);

    // Close the connection
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await queryClient.end();

    console.log('✅ Connection test completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error: Database connection failed!');
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

// Run the test
// eslint-disable-next-line @typescript-eslint/no-floating-promises
testDatabaseConnection();
