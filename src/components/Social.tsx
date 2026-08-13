import React from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData';

export const Social: React.FC = () => {
  const phoneNumber = '+251 979983258';
  const displayPhone = '+251 979 983 258';

  return (
    <section id="social" className="contact-section">
      <div className="wrap">
        <div className="contact-card reveal">

          {/* Decorative elements */}
          <div
            className="contact-glow contact-glow-one"
            aria-hidden="true"
          />
          <div
            className="contact-glow contact-glow-two"
            aria-hidden="true"
          />

          <div className="contact-content">

            {/* Main contact information */}
            <div className="contact-main">
              <span className="contact-kicker">
                LET&apos;S CONNECT
              </span>

              <h2>
                Have a project
                <br />
                <span>in mind?</span>
              </h2>

              <p>
                I&apos;m always open to interesting projects,
                collaborations and new opportunities.
              </p>

              {/* Phone CTA */}
              <a
                href={`tel:${phoneNumber}`}
                className="contact-phone"
                aria-label={`Call ${displayPhone}`}
              >
                <span className="phone-circle" aria-hidden="true">
                  ↗
                </span>

                <span className="phone-text">
                  <small>CALL ME</small>
                  <strong>{displayPhone}</strong>
                </span>
              </a>
            </div>

            {/* Social links */}
            <div className="contact-side">

              <div >
                <span
                  
                />
                <span></span>
              </div>

              <span className="connect-label">
                FIND ME ON
              </span>

              <div className="social-links">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="social-link"
                    style={
                      {
                        '--social-color': link.colorVar,
                      } as React.CSSProperties
                    }
                    aria-label={`Visit my ${link.label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="social-symbol"
                      aria-hidden="true"
                    >
                      {link.badge}
                    </span>

                    <span className="social-name">
                      {link.label}
                    </span>

                    <span
                      className="social-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="contact-footer">
            <span>OPEN TO COLLABORATION</span>
            <span className="footer-line" />
            <span>2026</span>
          </div>

        </div>
      </div>
    </section>
  );
};