import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

export const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [formStatus, setFormStatus] = useState<
    'idle' | 'sending' | 'done'
  >('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formStatus !== 'idle') return;
    if (!formRef.current) return;

    setFormStatus('sending');

    try {
      await emailjs.sendForm(
        'service_d9buxpk',
        'template_u91hrul',
        formRef.current,
        {
          publicKey: 'rpzDjpyEPm4PbqxfK',
        }
      );

      setFormStatus('done');

      setTimeout(() => {
        setFormStatus('idle');
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      }, 2600);

    } catch (error) {
      console.error('Email sending failed:', error);

      setFormStatus('idle');
      alert('Failed to send your message. Please try again.');
    }
  };

  return (
    <section id="contact" className="contact divider">
      <div className="contact-glow" />

      <div className="wrap contact-inner">
        <div className="eyebrow" style={{ justifyContent: 'center' }}>
          Project inquiry
        </div>

   <h2 style={{ marginTop: '24px' }}>
  Have an idea? Let&apos;s{' '}
  <span className="grad-text">build it.</span>
</h2>
<p className="contact-sub">
  Building modern digital products from frontend to backend.
</p>




        <form
          ref={formRef}
          className="inquiry-form"
          id="inquiryForm"
          onSubmit={handleSubmit}
        >
          <div className="field">
            <label htmlFor="fName">Full name</label>

            <input
              type="text"
              id="fName"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="fEmail">Email address</label>

            <input
              type="email"
              id="fEmail"
              name="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="fMessage">Message</label>

            <textarea
              id="fMessage"
              name="message"
              placeholder="Tell me about your project…"
              value={formData.message}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  message: e.target.value,
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary form-submit ${formStatus}`}
            id="formSubmit"
          >
            <span className="btn-label">Send inquiry →</span>

            <span className="btn-spin">
              <span className="spinner" /> Sending…
            </span>

            <span className="btn-done">
              ✓ Sent — I'll reply soon
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};