import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    new FastifyAdapter(),
  );
  const config = app.get(ConfigService);

  const prefix = config.get<string>('API_PREFIX', 'api');
  const version = config.get<string>('API_VERSION', '1');
  const port = config.get<number>('PORT', 3000);

  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
  });

  await app.listen(port, '0.0.0.0');
  console.log('API is running on port', port);
}
void bootstrap();
