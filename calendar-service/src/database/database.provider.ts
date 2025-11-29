import { drizzle } from 'drizzle-orm/postgres-js';
import { ConfigService } from '@nestjs/config';
import { schema } from '@corpcal/database';
import * as postgresModule from 'postgres';

export const DATABASE_CLIENT = 'DATABASE_CLIENT';

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

export const databaseProvider = {
  provide: DATABASE_CLIENT,
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error(
        'DATABASE_URL environment variable is required. Please set it in your .env file or Render environment variables.'
      );
    }

    // Log connection info (without password) for debugging
    // eslint-disable-next-line no-console
    console.log(
      `Connecting to database: ${maskConnectionString(connectionString)}`
    );

    // Access the default export - when externalized, require() returns the default directly
    // Type assertion needed because postgres module's default export typing varies by build target
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const postgres = (postgresModule as any).default || postgresModule;

    // Create postgres client with connection pooling
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const queryClient = postgres(connectionString, {
      max: configService.get<number>('DB_MAX_CONNECTIONS', 10),
      idle_timeout: configService.get<number>('DB_IDLE_TIMEOUT', 20),
      connect_timeout: configService.get<number>('DB_CONNECT_TIMEOUT', 10),
      connection: {
        application_name: 'calendar-service',
      },
    });

    // Create Drizzle client with schema
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const db = drizzle(queryClient, { schema });

    return db;
  },
  inject: [ConfigService],
};

export type Database = ReturnType<typeof drizzle<typeof schema>>;
