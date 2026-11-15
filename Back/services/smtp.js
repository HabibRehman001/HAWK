import nodemailer from 'nodemailer';
import { ENV_KEYS } from '../constants/index.js';

let transporter = null;

/**
 * Create (or reuse) a Nodemailer transporter from SMTP env vars.
 * Called on first mail send; fails loudly if credentials are missing.
 */
export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env[ENV_KEYS.SMTP_HOST];
  const port = Number(process.env[ENV_KEYS.SMTP_PORT] || 587);
  const user = process.env[ENV_KEYS.SMTP_USER];
  const pass = process.env[ENV_KEYS.SMTP_PASS];
  const secure =
    String(process.env[ENV_KEYS.SMTP_SECURE] || 'false').toLowerCase() === 'true';

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in Back/.env'
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
}

/**
 * Send a contact-form email to MAIL_TO.
 * @param {{ name: string, email: string, website?: string, projectTypes?: string[], message: string }} data
 */
export async function sendContactMail(data) {
  const to = process.env[ENV_KEYS.MAIL_TO];
  if (!to) {
    throw new Error('MAIL_TO is not set in Back/.env');
  }

  const fromName = process.env[ENV_KEYS.SMTP_FROM_NAME] || 'BlueHawk Website';
  const fromEmail =
    process.env[ENV_KEYS.SMTP_FROM_EMAIL] || process.env[ENV_KEYS.SMTP_USER];

  const types =
    Array.isArray(data.projectTypes) && data.projectTypes.length
      ? data.projectTypes.join(', ')
      : '—';

  const text = [
    'New contact form submission',
    '---------------------------',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Website: ${data.website || '—'}`,
    `Project types: ${types}`,
    '',
    'Message:',
    data.message,
  ].join('\n');

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
    <p><strong>Website:</strong> ${escapeHtml(data.website || '—')}</p>
    <p><strong>Project types:</strong> ${escapeHtml(types)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</p>
  `;

  const mailer = getTransporter();

  return mailer.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    replyTo: data.email,
    subject: `BlueHawk contact — ${data.name}`,
    text,
    html,
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
