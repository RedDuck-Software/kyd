import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const globalPrefix = 'api';

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix(globalPrefix);

  const logger = app.get(Logger);
  const config = new DocumentBuilder().setTitle('KYD Metadata API').addBearerAuth().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/swagger`, app, document);

  const port = process.env.PORT || process.env.API_PORT || 3002;

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);

  logger.log(`Swagger is running on: http://localhost:${port}/${globalPrefix}/swagger`);
}
bootstrap();
