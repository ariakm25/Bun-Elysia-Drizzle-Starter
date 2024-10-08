import { Elysia } from 'elysia';
import { logger } from './common/utils/log';
import swagger from './common/libs/swagger';
import { api } from './api';
import staticPlugin from '@elysiajs/static';
import cors from '@elysiajs/cors';
import rateLimiter from './common/libs/ratelimiter';
import { bullboardPlugin } from './common/plugins/bullboard.plugin';
import { join } from 'path';

export const publicPath = join(__dirname, '../public');

const app = new Elysia()
  .use(bullboardPlugin)
  .use(staticPlugin())
  .use(cors())
  .use(swagger())
  .use(rateLimiter())
  .use(api);

try {
  app.listen(process.env.PORT || 3000);
} catch (e) {
  console.log(e);
  logger.error('Error starting server', e);
  process.exit(1);
}

logger.info(
  `Service is running at ${app.server?.hostname}:${app.server?.port}`,
);
