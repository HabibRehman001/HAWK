import { sendContactMail } from '../services/smtp.js';

/**
 * POST /api/contact
 * Body: { name, email, website?, projectTypes?, message }
 */
export async function handleContactForm(req, res) {
  try {
    const { name, email, website = '', projectTypes = [], message } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ ok: false, error: 'Valid name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({ ok: false, error: 'Valid email is required.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ ok: false, error: 'Message must be at least 10 characters.' });
    }

    await sendContactMail({
      name: name.trim(),
      email: String(email).trim(),
      website: String(website || '').trim(),
      projectTypes: Array.isArray(projectTypes) ? projectTypes : [],
      message: message.trim(),
    });

    return res.status(200).json({ ok: true, message: 'Message sent.' });
  } catch (err) {
    console.error('[contact]', err.message);
    return res.status(500).json({
      ok: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
}
