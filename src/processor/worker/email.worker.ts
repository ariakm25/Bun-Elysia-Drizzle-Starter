import { Job, Worker } from 'bullmq';
import { sharedProcessorRedisConn } from '../connection/redis';
import {
  SEND_EMAIL_RESET_PASSWORD_QUEUE_NAME,
  SendEmailResetPasswordData,
} from '../queue/email/email.queue.type';

export const sendResetPasswordEmailWorker =
  new Worker<SendEmailResetPasswordData>(
    SEND_EMAIL_RESET_PASSWORD_QUEUE_NAME,
    async (job) => {
      // Send email logic here
      console.log('Send email reset password worker', job.data);
    },
    {
      connection: sharedProcessorRedisConn,
      autorun: false,
      removeOnComplete: {
        count: 5000,
      },
    },
  );
