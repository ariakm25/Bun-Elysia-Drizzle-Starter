import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';
import { logger } from './common/utils/log';
import swagger from './common/libs/swagger';
import handlers from './handlers';

const app = new Elysia()
  .use(handlers)
  .use(swagger())
  .use(rateLimit({ max: 5 }));

try {
  app.listen(process.env.PORT || 3000);
} catch (e) {
  logger.error('Error starting server', e);
  process.exit(1);
}

logger.info(
  `Service is running at ${app.server?.hostname}:${app.server?.port}`,
);
