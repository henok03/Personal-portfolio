import React, { useEffect } from 'react';
import { SKILL_STACKS } from '../data/portfolioData';

export const Skills: React.FC = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.stack-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.querySelectorAll<HTMLElement>('.stack-row').forEach((row) => {
        const pct = parseFloat(row.dataset.pct || '0');
        const fill = row.querySelector<HTMLElement>('.stack-fill');
        if (fill) fill.style.setProperty('--pct', `${pct}%`);
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('filled');
            entry.target.querySelectorAll<HTMLElement>('.stack-fill').forEach((f) => {
              f.style.width = f.style.getPropertyValue('--pct');
            });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((c) => io.observe(c));

    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <section id="skills" className="divider">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2>A stack, not a checklist.</h2>
          <p>The technologies I reach for most, grouped by where they sit in the stack.</p>
        </div>

        <div className="stack-grid reveal stagger">
          {SKILL_STACKS.map((catGroup) => (
            <div key={catGroup.cat} className="stack-card" data-cat={catGroup.cat}>
              <div className="stack-card-head">
                <span className="stack-dot" />
                <span className="stack-title">
                  <b>{catGroup.cat}</b>.stack
                </span>
              </div>
              <div className="stack-body">
                {catGroup.skills.map((skill) => (
                  <div key={skill.name} className="stack-row" data-pct={skill.pct}>
                    <span className="stack-name">{skill.name}</span>
                    <span className="stack-val">{skill.pct}%</span>
                    <span className="stack-bar">
                      <span className="stack-fill" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
       
      </div>
    </section>
  );
};
