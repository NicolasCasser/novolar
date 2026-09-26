import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const defaultCorsOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://novolar-web.vercel.app',
];

function resolveCorsOrigins(): string[] {
  const configured = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return configured.length > 0 ? configured : defaultCorsOrigins;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const corsOrigins = resolveCorsOrigins();

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  for (const origin of corsOrigins) {
    if (new URL(origin).pathname !== '/') {
      console.warn(
        `CORS_ORIGINS contains "${origin}", which has a path. Browsers never send a path in the Origin header, so this entry never matches.`,
      );
    }
  }

  console.log(`CORS enabled for: ${corsOrigins.join(', ')}`);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

void bootstrap();
