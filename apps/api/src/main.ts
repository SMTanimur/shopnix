import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { FileLoggerService } from './common/logger/file-logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const fileLogger = app.get(FileLoggerService);

  // Use Structured File Logger
  app.useLogger(fileLogger);

  // Security Headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    })
  );

  // CORS Configuration
  const corsOrigin = configService.get<string>('corsOrigin', 'http://localhost:5000');
  app.enableCors({
    origin: corsOrigin === '*' ? true : [corsOrigin],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global API Prefix
  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Global File Logging Interceptor (records every controller & endpoint to disk)
  app.useGlobalInterceptors(new LoggingInterceptor(fileLogger));

  // Global Exception Filter with File Logging
  app.useGlobalFilters(new GlobalHttpExceptionFilter(fileLogger));

  // Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shopnix API')
    .setDescription(
      'Enterprise Ecommerce Operations & Logistics Management Platform API specification'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Shopnix API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get<number>('port', 8000);
  await app.listen(port);
  fileLogger.log(`[Shopnix API] Running on: http://localhost:${port}/${apiPrefix}`, 'Bootstrap');
  fileLogger.log(`[Shopnix API] Swagger Docs: http://localhost:${port}/api/docs`, 'Bootstrap');
  fileLogger.log(`[Shopnix API] Controller & API logs written to: ${process.env.LOG_DIR || 'logs/'}`, 'Bootstrap');
}

bootstrap();
