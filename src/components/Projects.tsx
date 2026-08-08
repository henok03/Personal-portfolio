import React, { useEffect } from 'react';
import { PROJECTS } from '../data/portfolioData';

export const Projects: React.FC = () => {
  useEffect(() => {
    if (!window.matchMedia('(hover:hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');
    const cleanupFns: Array<() => void> = [];

    cards.forEach((card) => {
      card.style.transition = 'transform .5s cubic-bezier(.16,.84,.32,1), border-color .4s ease';

      const handleMouseMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      };

      const handleMouseLeave = () => {
        card.style.transform = '';
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      cleanupFns.push(() => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <section id="work" className="divider">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2>Selected work.</h2>
          <p>Three recent projects. Tilt the cards — content and previews are placeholders, ready for your real case studies.</p>
        </div>
        <div className="proj-grid">
          {PROJECTS.map((project) => (
            <div key={project.id} className="proj-card reveal" data-tilt>
              <div className="proj-visual">
                <div className="plate" />
                <div className="grid-overlay" />
                <span className="proj-status">{project.status}</span>
              </div>
              <div className="proj-body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="proj-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="proj-links">
                  <a href={project.demoUrl}>Live demo →</a>
                  <a href={project.githubUrl}>GitHub →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
