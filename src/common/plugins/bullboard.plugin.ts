import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { createBullBoard } from '@bull-board/api';
import { sendEmailResetPasswordQueue } from '../../processor/queue/email/email.queue';
import { BullBoardElysiaAdapter } from '../libs/bullboard';
import Elysia from 'elysia';

const bullboardServerAdapter = new BullBoardElysiaAdapter('/bullboard');

createBullBoard({
  queues: [new BullMQAdapter(sendEmailResetPasswordQueue)],
  serverAdapter: bullboardServerAdapter,
});

export const bullboardPlugin = (app: Elysia) => {
  return app.use(bullboardServerAdapter.registerPlugin());
};
