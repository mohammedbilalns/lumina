import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Article Feed')
    .setDescription('Article Feed API')
    .setVersion('1.0')
    .addTag('articles')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
