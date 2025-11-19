import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { Database } from '@corpcal/database';

@Injectable()
export class AppService {
  constructor(@Inject('DB') private readonly db: Database) {}

  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }

  async getReadiness(): Promise<{ ready: boolean; database?: string }> {
    try {
      // Check database connectivity with a simple query
      await this.db.execute(sql`SELECT 1`);
      return {
        ready: true,
        database: 'connected',
      };
    } catch (error) {
      return {
        ready: false,
        database: 'disconnected',
      };
    }
  }
}
