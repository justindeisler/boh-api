import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { logger, LoggerService } from './infrastructure/config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      bodyLimit: 10485760, // 10MB
      trustProxy: true,
    }),
    {
      logger: new LoggerService(),
    },
  );

  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  // Enable shutdown hooks
  await prismaService.enableShutdownHooks(app);

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('BOH Event Management API')
    .setDescription(
      'RESTful API for managing events, users, venues, and bookings. ' +
      'This API provides comprehensive event management capabilities including ' +
      'user authentication, event creation and management, venue administration, and ticket booking.'
    )
    .setVersion('1.0')
    .setContact(
      'BOH Development Team',
      'https://github.com/yourusername/boh-api',
      'support@boh-events.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://192.168.178.63:3001', 'Production Server')
    .addServer('http://localhost:3001', 'Local Development Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Events - Public', 'Public event browsing and information endpoints')
    .addTag('Events - Admin', 'Administrative event management endpoints (requires authentication)')
    .addTag('Health', 'Application health and readiness check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
      tryItOutEnabled: true,
    },
    customSiteTitle: 'BOH API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Security - Disable CSP for Swagger docs
  await app.register(helmet as any, {
    contentSecurityPolicy: false, // Disabled to allow Swagger UI to work properly
    // Alternative: You can enable CSP with exceptions for Swagger routes if needed
  });

  // Cookies
  await app.register(fastifyCookie as any, {
    secret: configService.get<string>('jwt.secret'),
  });

  // CORS - Allow all origins in development
  const nodeEnv = configService.get<string>('app.env');
  app.enableCors({
    origin: nodeEnv === 'development' ? true : configService.get<string[]>('cors.origin'),
    credentials: configService.get<boolean>('cors.credentials'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Get port and start server
  const port = configService.get<number>('app.port', 3000);
  const host = '0.0.0.0';

  await app.listen(port, host);

  logger.info(`🚀 Application is running on: http://localhost:${port}`, 'Bootstrap');
  logger.info(`📖 API Documentation: http://localhost:${port}/api/docs`, 'Bootstrap');
  logger.info(`🏥 Health Check: http://localhost:${port}/health`, 'Bootstrap');
  logger.info(`🏥 Readiness Check: http://localhost:${port}/health/ready`, 'Bootstrap');
  logger.info(`🔐 Environment: ${configService.get<string>('app.env')}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  logger.error('Failed to start application', error.stack, 'Bootstrap');
  process.exit(1);
});
