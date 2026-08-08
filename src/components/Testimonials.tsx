import React from 'react';
import { TESTIMONIALS } from '../data/portfolioData';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="divider">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2>What it's like to work together.</h2>
          <p>A few words from people I've built with. Placeholder quotes — swap in your own.</p>
        </div>
        <div className="test-grid reveal">
          {TESTIMONIALS.map((item, idx) => (
            <div key={idx} className="test-card">
              <p className="test-quote">{item.quote}</p>
              <div className="test-who">
                <div className="test-avatar">{item.avatar}</div>
                <div>
                  <div className="test-name">{item.name}</div>
                  <div className="test-role">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
