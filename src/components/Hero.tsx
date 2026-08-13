import React, { useEffect, useRef } from 'react';
import { PERSONAL_INFO, CODE_STREAM_LINES } from '../data/portfolioData';

export const Hero: React.FC = () => {
  const rigRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Parallax mouse depth on portrait stage
    const rig = rigRef.current;
    const stage = stageRef.current;
    if (!rig || !stage) return;
    if (!window.matchMedia('(hover:hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    stage.style.transition = 'transform .5s cubic-bezier(.16,.84,.32,1)';

    const handleMouseMove = (e: MouseEvent) => {
      const r = rig.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(20px)`;
    };

    const handleMouseLeave = () => {
      stage.style.transform = '';
    };

    rig.addEventListener('mousemove', handleMouseMove);
    rig.addEventListener('mouseleave', handleMouseLeave);

    // Magnetic buttons
    const btns = document.querySelectorAll<HTMLElement>('.btn');
    const cleanupBtns: Array<() => void> = [];

    btns.forEach((btn) => {
      const onBtnMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.22}px)`;
      };
      const onBtnLeave = () => {
        btn.style.transform = '';
      };
      btn.addEventListener('mousemove', onBtnMove);
      btn.addEventListener('mouseleave', onBtnLeave);
      cleanupBtns.push(() => {
        btn.removeEventListener('mousemove', onBtnMove);
        btn.removeEventListener('mouseleave', onBtnLeave);
      });
    });

    return () => {
      rig.removeEventListener('mousemove', handleMouseMove);
      rig.removeEventListener('mouseleave', handleMouseLeave);
      cleanupBtns.forEach((fn) => fn());
    };
  }, []);

  const codeStreamText = (CODE_STREAM_LINES.join('\n') + '\n').repeat(3);

  return (
    <section className="hero" id="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="hero-eyebrow eyebrow">{PERSONAL_INFO.eyebrow}</div>
          <h1>
            <span className="line">I design the</span>
            <span className="line">human side.</span>
            <span className="line grad-text">I build the code side.</span>
          </h1>
          <p className="hero-sub">
            Hi, I'm Henok — a full stack developer who moves fluidly between interface and infrastructure. I design the experience, then build the frontend and backend that make it real, fast, and reliable.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View my work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Hire me <span className="arrow">→</span>
            </a>
          </div>
        </div>

        <div className="portrait-rig" id="portraitRig" ref={rigRef}>
          <div className="code-stream left">
            <div className="code-col" id="codeColLeft">
              {codeStreamText}
            </div>
          </div>
          <div className="code-stream right">
            <div className="code-col" id="codeColRight">
              {codeStreamText}
            </div>
          </div>

          <div className="p-wave" />
          <div className="p-glow" />
          <div className="p-hologrid" />
          <div className="p-ring r1" />
          <div className="p-ring r2" />
          <div className="p-ring r3" />
          <div className="p-orbit-dot d1" />
          <div className="p-orbit-dot d2" />
          <div className="p-orbit-dot d3" />

          <div className="portrait-stage" id="portraitStage" ref={stageRef}>
            <div className="hud-panel c1">
              <b>const</b> dev = &#123;<br />
              &nbsp;&nbsp;name: <span>'Henok'</span>,<br />
              &nbsp;&nbsp;stack: <span>'full'</span><br />
              &#125;
            </div>
            <div className="hud-panel c4">
              // server: <b>online</b><br />
              // db: <b>connected</b>
            </div>
            <div className="scan" />
            <img src="portrait.png" alt="Image of Henok" loading="eager" />
            <div className="hud-panel c2">
              <b>export default</b><br />
              function Stack() &#123;<br />
              &nbsp;&nbsp;return &lt;Full/&gt;<br />
              &#125;
            </div>
            <div className="hud-panel c3">// status: <b>shipping</b></div>
            <div className="tech-chip t1">⚛</div>
            <div className="tech-chip t2">TS</div>
            <div className="tech-chip t3">JS</div>
          </div>
        </div>
      </div>
    </section>
  );
};
