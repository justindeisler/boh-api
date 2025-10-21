import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../config/logger.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query' as never, (e: any) => {
        logger.debug(`Query: ${e.query}`, 'PrismaService');
        logger.debug(`Duration: ${e.duration}ms`, 'PrismaService');
      });
    }

    // Log errors
    this.$on('error' as never, (e: any) => {
      logger.error(`Prisma Error: ${e.message}`, e.target, 'PrismaService');
    });

    // Log warnings
    this.$on('warn' as never, (e: any) => {
      logger.warn(`Prisma Warning: ${e.message}`, 'PrismaService');
    });

    // Log info
    this.$on('info' as never, (e: any) => {
      logger.info(`Prisma Info: ${e.message}`, 'PrismaService');
    });
  }

  async onModuleInit() {
    await this.$connect();
    logger.info('Database connection established', 'PrismaService');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    logger.info('Database connection closed', 'PrismaService');
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
