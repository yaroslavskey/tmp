import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('User module')
    .setDescription('User module for nest project')
    .setVersion('1.0.0')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('user/docs', app, document);

  await app.listen(PORT, () => console.log(`Server run on port ${PORT}`));
}
bootstrap();
