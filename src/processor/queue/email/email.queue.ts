import { Queue } from 'bullmq';
import {
  SEND_EMAIL_RESET_PASSWORD_QUEUE_NAME,
  SendEmailResetPasswordData,
} from './email.queue.type';
import { sharedProcessorRedisConn } from '../../connection/redis';

/**
 * Example usage:
 * await sendEmailResetPasswordQueue.add(
 *  SEND_EMAIL_RESET_PASSWORD_QUEUE_NAME,
 *  {
 *    email: 'example@mail.com',
 *    token: 'example-token',
 *  },
 * );
 **/
export const sendEmailResetPasswordQueue =
  new Queue<SendEmailResetPasswordData>(SEND_EMAIL_RESET_PASSWORD_QUEUE_NAME, {
    connection: sharedProcessorRedisConn,
  });
