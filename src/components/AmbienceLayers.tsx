import React, { useEffect, useRef } from 'react';

export const AmbienceLayers: React.FC = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (!window.matchMedia('(hover:hover)').matches) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let gx = mx,
      gy = my;
    let active = false;
    let animId: number;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mx = e.clientX;
      my = e.clientY;
      if (!active) {
        active = true;
        glow.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      glow.style.opacity = '0';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    function raf() {
      animId = requestAnimationFrame(raf);
      const ease = reduceMotion ? 1 : 0.1;
      gx += (mx - gx) * ease;
      gy += (my - gy) * ease;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    }
    raf();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div className="aurora-layer">
        <div className="aurora-blob ab1" />
        <div className="aurora-blob ab2" />
        <div className="aurora-blob ab3" />
        <div className="aurora-blob ab4" />
        <div className="aurora-blob ab5" />
        <div className="aurora-blob ab6" />
      </div>
      <div className="stars-css" />
      <div className="light-rays" />
      <div className="cyber-grid" />
      <div className="noise" />
      <div className="vignette" />
      <div id="cursorGlow" ref={glowRef} />
      <div className="scroll-cue">
        <span>SCROLL</span>
        <span className="line" />
      </div>
    </>
  );
};
