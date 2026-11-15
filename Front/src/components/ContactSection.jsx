import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';

/**
 * PROPS (all optional)
 * onSubmit      async (data) => void   data = { name, email, website, projectTypes, message }
 *                                      throw an error to show the failure message
 * title         string[]               headline, one entry per line
 * intro         string
 * address       string
 * addressHref   string                 optional maps / place link
 * hours         string
 * email         string
 * socials       [{ name, href }]
 * projectTypes  string[]               selectable chips, pass [] to hide them
 * replyTime     string                 small note next to the button
 */

const MAPS_URL =
  'https://www.google.com/maps/place/2300+Yonge+St,+Toronto,+ON+M4P+1E4,+Canada/@43.7072921,-79.4021398,17z/data=!3m1!4b1!4m6!3m5!1s0x882b353cbf566647:0x2ce62dff5474f3bb!8m2!3d43.7074185!4d-79.3996975!16s%2Fg%2F11w3m1jds_?entry=ttu';

const ICONS = {
  X: (
    <path
      d="M18.2 2.5h3.3l-7.2 8.2 8.5 10.8h-6.7l-5.2-6.8-6 6.8H1.6l7.7-8.8L1.2 2.5H8l4.7 6.2 5.5-6.2Zm-1.2 17h1.8L7.1 4.4H5.2L17 19.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </>
  ),
  YouTube: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
    </>
  ),
  GitHub: (
    <path d="M9 19c-4 1.2-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.600 4.600 0 0 0 4 9.500c0 4.600 2.700 5.700 5.500 6-.6.600-.6 1.200-.5 2V21" />
  ),
  LinkedIn: (
    <path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      fill="currentColor"
      stroke="none"
    />
  ),
  Facebook: (
    <path
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      fill="currentColor"
      stroke="none"
    />
  ),
};

const EMPTY = { name: '', email: '', website: '', message: '' };

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address.';
  if (v.website && !/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v.website.trim()))
    e.website = 'Enter a valid website address.';
  if (v.message.trim().length < 10)
    e.message = 'Please add a few more details (at least 10 characters).';
  return e;
};

export default function ContactSection({
  onSubmit,
  title = ['Ready to elevate', 'your digital', 'presence?'],
  intro =
    "Tell us about your project. We'll review it and come back with a clear plan, timeline and next steps.",
  address = '2300 Yonge St, Toronto, ON M4P 1E4, Canada',
  addressHref = MAPS_URL,
  hours = 'Monday to Friday, 9:00 – 18:00',
  email = 'info@bluehawk.com',
  socials = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/blue-hawke/' },
    { name: 'Facebook', href: 'https://www.facebook.com/p/Blue-Hawke-100091523956057/' },
    { name: 'Instagram', href: 'https://www.instagram.com/bluehawke.digital/' },
  ],
  projectTypes = ['Website', 'Branding', 'Pitch deck', 'Mobile app'],
  replyTime = 'We reply within one business day.',
}) {
  const root = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [types, setTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let io;
    const ctx = gsap.context(() => {
      gsap.set('.cs-line > span', { yPercent: 105 });
      gsap.set(['.cs-fade', '.cs-panel'], { opacity: 0, y: 24 });
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .to('.cs-line > span', { yPercent: 0, duration: 1, stagger: 0.1 })
            .to('.cs-fade', { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, '-=0.6')
            .to('.cs-panel', { opacity: 1, y: 0, duration: 1 }, 0.2);
        },
        { threshold: 0.2 }
      );
      if (root.current) io.observe(root.current);
    }, root);

    return () => {
      io?.disconnect();
      ctx.revert();
    };
  }, []);

  const change = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };
  const blur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(values));
  };
  const toggleType = (t) =>
    setTypes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, website: true, message: true });
    if (Object.keys(errs).length) {
      root.current.querySelector("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus('sending');
    try {
      if (onSubmit) await onSubmit({ ...values, projectTypes: types });
      else await new Promise((r) => setTimeout(r, 1200));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setTypes([]);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  const inputBase =
    'w-full rounded-lg border bg-[#0a1230] px-4 py-3.5 text-[16px] text-[#cfe6ff] placeholder:text-[#5f7aa2] outline-none transition ' +
    'focus:border-[#1e8fff] focus:bg-[#0c1638] focus:ring-4 focus:ring-[#1e8fff]/15';

  const renderField = ({ name, label, hint, textarea, ...rest }) => {
    const err = touched[name] && errors[name];
    const Tag = textarea ? 'textarea' : 'input';
    return (
      <div key={name}>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor={`cs-${name}`} className="text-sm font-medium text-[#cfe6ff]">
            {label}
          </label>
          {hint && <span className="text-xs text-[#6f88ad]">{hint}</span>}
        </div>
        <Tag
          id={`cs-${name}`}
          name={name}
          value={values[name]}
          onChange={change}
          onBlur={blur}
          rows={textarea ? 5 : undefined}
          maxLength={textarea ? 1000 : undefined}
          aria-invalid={!!err}
          aria-describedby={err ? `cs-${name}-err` : undefined}
          className={`${inputBase} ${textarea ? 'resize-none' : ''} ${
            err ? 'border-[#ff6b81]/60' : 'border-[#a0cdff]/[0.12]'
          }`}
          {...rest}
        />
        {err && (
          <p id={`cs-${name}-err`} className="mt-2 text-sm text-[#ff7b8f]">
            {err}
          </p>
        )}
      </div>
    );
  };

  const hairline = 'border-[#a0cdff]/[0.14]';

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-[#040617] text-[#cfe6ff] antialiased"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(30,143,255,0.14),transparent)]"
      />

      <div className="relative mx-auto grid max-w-[1280px] gap-16 px-6 pt-6 pb-24 md:px-10 lg:grid-cols-12 lg:gap-12 lg:pt-10 lg:pb-32">
        <div className="hidden lg:col-span-6 lg:block">
          <h2
            className="text-[clamp(44px,6.4vw,92px)] font-semibold leading-[0.96] tracking-[-0.05em]"
            aria-label={title.join(' ')}
          >
            {title.map((line) => (
              <span key={line} className="cs-line block overflow-hidden pb-[0.08em]" aria-hidden>
                <span className="block">{line}</span>
              </span>
            ))}
          </h2>

          <p className="cs-fade mt-8 max-w-md text-lg leading-relaxed text-[#a9c3e6]">{intro}</p>

          <dl className={`cs-fade mt-12 max-w-md border-t ${hairline}`}>
            {[
              ['Address', address, addressHref],
              ['Office hours', hours],
              ['Email', email, `mailto:${email}`],
            ].map(([label, value, href]) => (
              <div
                key={label}
                className={`grid grid-cols-[120px_1fr] gap-4 border-b py-4 ${hairline}`}
              >
                <dt className="text-sm text-[#7f98bd]">{label}</dt>
                <dd className="text-[16px]">
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                      className="group inline-flex items-center gap-1 underline decoration-[#1e8fff]/60 underline-offset-[5px] transition hover:decoration-[#cfe6ff]"
                    >
                      {value}
                      <ArrowUpRight
                        size={14}
                        className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="cs-fade mt-8 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="grid size-10 place-items-center rounded-full border border-[#a0cdff]/20 text-[#cfe6ff] transition hover:border-[#1e8fff] hover:bg-[#1e8fff]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6fb8ff]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[s.name]}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="cs-panel w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none lg:col-span-6">
          <div
            className={`rounded-2xl border ${hairline} bg-[#070d26] p-6 shadow-[0_40px_100px_-40px_rgba(30,143,255,0.4)] md:p-10`}
          >
            {status === 'sent' ? (
              <div role="status" className="grid justify-items-start gap-4 py-10">
                <span className="grid size-12 place-items-center rounded-full bg-[#1e8fff]/15 text-[#4aa3ff] ring-1 ring-[#1e8fff]/40">
                  <Check size={24} strokeWidth={2.2} />
                </span>
                <h3 className="text-3xl font-semibold tracking-[-0.03em]">Message sent</h3>
                <p className="max-w-sm text-[#a9c3e6]">
                  Thanks{values.name ? `, ${values.name.split(' ')[0]}` : ''}. {replyTime}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 text-[15px] underline decoration-[#1e8fff]/60 underline-offset-[6px] transition hover:decoration-[#cfe6ff]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {renderField({
                    name: 'name',
                    label: 'Name',
                    autoComplete: 'name',
                    placeholder: 'Your full name',
                  })}
                  {renderField({
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    autoComplete: 'email',
                    placeholder: 'you@company.com',
                  })}
                </div>

                {renderField({
                  name: 'website',
                  label: 'Website',
                  hint: 'Optional',
                  autoComplete: 'url',
                  placeholder: 'yourwebsite.com',
                })}

                {projectTypes.length > 0 && (
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium">What do you need?</legend>
                    <div className="flex flex-wrap gap-2">
                      {projectTypes.map((t) => {
                        const on = types.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleType(t)}
                            className={`rounded-lg border px-4 py-2.5 text-[15px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6fb8ff] ${
                              on
                                ? 'border-[#1e8fff] bg-[#1e8fff]/15 text-white'
                                : 'border-[#a0cdff]/[0.14] text-[#a9c3e6] hover:border-[#a0cdff]/40'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {renderField({
                  name: 'message',
                  label: 'Project details',
                  textarea: true,
                  placeholder: 'Goals, timeline, anything that helps us understand the project.',
                })}

                {status === 'error' && (
                  <p role="alert" className="text-sm text-[#ff7b8f]">
                    Something went wrong sending your message. Please try again or email us
                    directly.
                  </p>
                )}

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#6f88ad]">{replyTime}</p>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#1597ff] to-[#0057ff] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_26px_rgba(0,100,255,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,100,255,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6fb8ff] disabled:cursor-progress disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {status === 'sending' ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" /> Sending
                      </>
                    ) : (
                      'Send message'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
