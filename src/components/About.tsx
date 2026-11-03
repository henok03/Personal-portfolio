import React from 'react';
import { PERSONAL_INFO, STORY_ITEMS } from '../data/portfolioData';

export const About: React.FC = () => {
  return (
    <section id="about">
      <div className="wrap about-grid">
        <div className="reveal">
          <div className="eyebrow">01 — About</div>
          <p className="about-lead" style={{ marginTop: '26px' }}>
            Half of what I build is <span className="grad-text">visible</span> — responsive interfaces, smooth interactions, and clean design. The other half is <span className="grad-text">behind the scenes</span> — secure backends, databases, and APIs working together seamlessly.
          </p>

          <p className="about-body">{PERSONAL_INFO.bioBody}</p>

          <div className="about-tags">
            {PERSONAL_INFO.aboutTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="story reveal">
          {STORY_ITEMS.map((item) => (
            <div key={item.yr} className="story-item">
              <div className="yr">{item.yr}</div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
