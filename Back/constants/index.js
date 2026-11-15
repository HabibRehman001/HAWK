/** Shared backend constants (non-secret). Secrets come from process.env. */

export const DEFAULT_PORT = 3000;

export const CONTACT_FIELDS = ['name', 'email', 'website', 'projectTypes', 'message'];

export const ENV_KEYS = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  CLIENT_URL: 'CLIENT_URL',
  MAIL_TO: 'MAIL_TO',
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_SECURE: 'SMTP_SECURE',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASS: 'SMTP_PASS',
  SMTP_FROM_NAME: 'SMTP_FROM_NAME',
  SMTP_FROM_EMAIL: 'SMTP_FROM_EMAIL',
};
