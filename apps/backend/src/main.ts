import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use((req, res, next) => {
    console.log('HTTP REQUEST:', req.method, req.url);

    next();
  });

  app.enableCors({
    origin: 'http://localhost:5174',
    credentials: true,
  });

  app.getHttpAdapter().get('/', (_req, res) => {
    res.status(200).send('Backend OK');
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
