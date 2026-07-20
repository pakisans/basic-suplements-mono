'use client';

import { useState } from 'react';
import { RichText } from '@/components/ui/RichText';
import { PUBLIC_PAYLOAD_URL } from '@/constants';

// Default fields shown when no CMS form is linked/populated
const DEFAULT_FIELDS = [
  { id: 'fullName', blockType: 'text', name: 'fullName', label: 'Full Name', required: true },
  { id: 'email', blockType: 'email', name: 'email', label: 'Email Address', required: true },
  { id: 'subject', blockType: 'text', name: 'subject', label: 'Subject', required: false },
  { id: 'message', blockType: 'textarea', name: 'message', label: 'Message', required: true },
];

const inputBase =
  'w-full border-b border-white/10 bg-transparent py-3 text-[14px] text-white placeholder-zinc-600 outline-none transition-colors focus:border-white/40';

function Field({ field, value, onChange }) {
  if (field.blockType === 'textarea') {
    return (
      <textarea
        name={field.name}
        placeholder={field.label}
        required={field.required}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} resize-none`}
      />
    );
  }
  if (field.blockType === 'select') {
    return (
      <select
        name={field.name}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} appearance-none bg-black`}
      >
        <option value="">{field.label}</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  if (field.blockType === 'checkbox') {
    return (
      <label className="flex cursor-pointer items-center gap-3">
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center border border-white/20">
          <input
            type="checkbox"
            name={field.name}
            required={field.required}
            checked={value === 'true'}
            onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
            className="sr-only"
          />
          {value === 'true' && (
            <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5 text-white">
              <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-[13px] text-zinc-400">{field.label}</span>
      </label>
    );
  }
  if (field.blockType === 'message') {
    return <p className="text-[13px] leading-relaxed text-zinc-500">{field.message}</p>;
  }
  return (
    <input
      type={field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'number' : 'text'}
      name={field.name}
      placeholder={field.label}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputBase}
    />
  );
}

export function FormBlock({ block }) {
  const form = block.form && typeof block.form === 'object' ? block.form : null;
  const fields = form?.fields?.length ? form.fields : DEFAULT_FIELDS;
  const submitLabel = form?.submitButtonLabel ?? 'Send Message';

  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name ?? f.id, ''])),
  );
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      if (form?.id) {
        const submissionData = Object.entries(values).map(([field, value]) => ({ field, value }));
        const res = await fetch(`${PUBLIC_PAYLOAD_URL}/api/form-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form: form.id, submissionData }),
        });
        if (!res.ok) throw new Error('failed');
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      aria-label="Contact"
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Left — intro + contact details */}
          <div className="flex flex-col justify-center gap-8">
            {block.enableIntro && block.introContent ? (
              <div className="[&_h2]:mb-4 [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white md:[&_h2]:text-5xl [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-tight [&_h1]:text-white [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_p]:mb-3 [&_p:last-child]:mb-0">
                <RichText content={block.introContent} />
              </div>
            ) : (
              <div>
                <p className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">
                  Contact
                </p>
                <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
                  Get in Touch
                </h2>
              </div>
            )}

            <div className="h-px w-12 bg-white/20" />

            <p className="text-[15px] leading-relaxed text-zinc-400">
              Have a question about our products, an order, or anything else?
              Fill in the form and we will get back to you within 24 hours.
            </p>

            <div className="space-y-5">
              {[
                {
                  label: 'Email',
                  value: 'info@basic-supplements.com',
                  icon: (
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  ),
                },
                {
                  label: 'Phone',
                  value: '+381 21 123 456',
                  icon: (
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                  ),
                },
                {
                  label: 'Working Hours',
                  value: 'Mon–Fri 09:00–17:00',
                  icon: (
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                  ),
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-zinc-900">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-500" aria-hidden="true">
                      {icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">{label}</p>
                    <p className="mt-0.5 text-[14px] text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="relative">
            <div className="border border-white/8 bg-zinc-900 p-8 md:p-10">
              {status === 'success' ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center border border-white/10">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-white">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[11px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">Message Sent</p>
                  {form?.confirmationMessage ? (
                    <div className="text-[15px] leading-relaxed text-zinc-300 [&_p]:mb-2 [&_p:last-child]:mb-0">
                      <RichText content={form.confirmationMessage} />
                    </div>
                  ) : (
                    <p className="text-[15px] text-zinc-300">
                      Thank you! We will get back to you within 24 hours.
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {fields.map((field, i) => (
                    <div key={field.id ?? i}>
                      {field.blockType !== 'message' && field.blockType !== 'checkbox' && (
                        <label className="mb-2 block text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                          {field.label}
                          {field.required && <span className="ml-1 text-zinc-700" aria-hidden="true">*</span>}
                        </label>
                      )}
                      <Field
                        field={field}
                        value={values[field.name ?? field.id] ?? ''}
                        onChange={(val) =>
                          setValues((prev) => ({ ...prev, [field.name ?? field.id]: val }))
                        }
                      />
                    </div>
                  ))}

                  {status === 'error' && (
                    <p className="text-[13px] text-red-400">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:border-white hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-40"
                    >
                      {status === 'submitting' ? 'Sending…' : submitLabel}
                      {status !== 'submitting' && (
                        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 transition-transform group-hover:translate-x-0.5">
                          <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* corner accents */}
          </div>
        </div>
      </div>

    </section>
  );
}
