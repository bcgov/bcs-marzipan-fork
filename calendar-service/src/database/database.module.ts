import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { db } from '@corpcal/database';

/**
 * Database Module
 * Provides Drizzle database instance globally
 * The db instance is initialized from @corpcal/database package
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DB',
      useValue: db,
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
