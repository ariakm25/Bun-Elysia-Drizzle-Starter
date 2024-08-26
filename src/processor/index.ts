import { sendResetPasswordEmailWorker } from './worker/email.worker';

export const runWorkers = () => {
  sendResetPasswordEmailWorker.run();
};

export const runSchedulers = () => {
  // Add your schedulers here
};
