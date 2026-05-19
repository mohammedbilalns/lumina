import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Article Feed')
    .setDescription(
      'Article Feed API with request validation details for authentication, articles, preferences, uploads, reactions, and user profile endpoints.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
    })
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
void bootstrap();
