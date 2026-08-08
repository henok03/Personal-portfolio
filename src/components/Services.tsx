import React from 'react';
import { SERVICES } from '../data/portfolioData';

export const Services: React.FC = () => {
  return (
    <section id="services" className="divider">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2>What I can help with.</h2>
          <p>Building modern, scalable web applications—from responsive interfaces to secure backend systems.</p>
        </div>

        <div className="svc-grid reveal">
          {SERVICES.map((svc) => (
            <div key={svc.num} className="svc-card">
              <div className="svc-num">{svc.num}</div>
              <h4>{svc.title}</h4>
              <p>{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
