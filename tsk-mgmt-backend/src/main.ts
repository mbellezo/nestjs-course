import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const {origin, port} = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    logger.verbose(`${process.env.NODE_ENV} enabled.`);
    app.enableCors();
  } else {
    app.enableCors({ origin });
    logger.log(`Accepting requests from origin "${origin}"`);
}

  const PORT = process.env.PORT || port;

  logger.log(`port: ${PORT}`);
  const server = await app.listen(PORT, () => {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.log(`Application listening on ${bind}`);
  });

}
bootstrap();
