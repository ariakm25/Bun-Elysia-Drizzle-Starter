export const SEND_EMAIL_RESET_PASSWORD_QUEUE_NAME = 'SEND_EMAIL_RESET_PASSWORD';
export interface SendEmailResetPasswordData {
  email: string;
  token: string;
}
