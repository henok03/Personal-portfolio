import React from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData';

export const Social: React.FC = () => {
  return (
    <section id="social" className="divider">
      <div className="wrap">
        <div
          className="sec-head reveal"
          style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '50px' }}
        >
          <div style={{ width: '100%' }}>
            <h2 style={{ margin: '0 auto' }}>Find me elsewhere.</h2>
            <p style={{ margin: '14px auto 0' }}>
              Replace the href="#" placeholders below with your real profile links.
            </p>
          </div>
        </div>
        <div className="social-grid reveal">
          {SOCIAL_LINKS.map((link) => (
            <div
              key={link.label}
              className="social-item"
              style={{ '--sc': link.colorVar } as React.CSSProperties}
            >
              <a href={link.href} className="social-badge" aria-label={link.label}>
                {link.badge}
              </a>
              <span className="social-label">{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
