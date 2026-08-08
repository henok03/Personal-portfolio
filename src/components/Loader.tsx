import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

const MESSAGES = [
  'Booting interface…',
  'Compiling components…',
  'Calibrating lighting…',
  'Rendering the universe…',
  'Almost there…',
];
const DURATION = 3200;

export const Loader: React.FC = () => {
  const [pct, setPct] = useState(0);
  const [statusMsg, setStatusMsg] = useState(MESSAGES[0]);
  const [glow, setGlow] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('loading');

    // Message interval
    let msgIndex = 0;
    const msgTimer = setInterval(() => {
      msgIndex = (msgIndex + 1) % MESSAGES.length;
      setStatusMsg(MESSAGES[msgIndex]);
    }, 300);

    // Glow timer
    const totalChars = PERSONAL_INFO.name.length;
    const glowTimer = setTimeout(() => {
      setGlow(true);
    }, totalChars * 55 + 900);

    // Progress animation tick
    let finished = false;
    let animFrame: number;
    const start = performance.now();

    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(msgTimer);
      setStatusMsg('Welcome.');
      setTimeout(() => {
        setHidden(true);
        document.documentElement.classList.remove('loading');
      }, 350);
    }

    function tick(now: number) {
      const elapsed = now - start;
      const linear = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - linear, 3);
      const currentPct = Math.round(eased * 100);
      setPct(currentPct);

      if (linear < 1) {
        animFrame = requestAnimationFrame(tick);
      } else {
        finish();
      }
    }

    animFrame = requestAnimationFrame(tick);

    const handleWindowLoad = () => {
      setTimeout(finish, DURATION);
    };
    window.addEventListener('load', handleWindowLoad);

    return () => {
      clearInterval(msgTimer);
      clearTimeout(glowTimer);
      cancelAnimationFrame(animFrame);
      window.removeEventListener('load', handleWindowLoad);
      document.documentElement.classList.remove('loading');
    };
  }, []);

  if (hidden) return null;

  // Split name into words & characters for CSS delay variables
  const words = PERSONAL_INFO.name.split(' ');
  let globalCharIndex = 0;

  return (
    <div id="loader" className={hidden ? 'hide' : ''}>
      <div class="loader-scanlines" />
      <div className="loader-inner">
        <div
          className={`loader-name-wrap ${glow ? 'glow' : ''}`}
          id="loaderNameWrap"
          data-text={PERSONAL_INFO.name}
        >
          <h1 className="loader-name" id="loaderName" aria-label={PERSONAL_INFO.name}>
            {words.map((word, wIdx) => {
              const chars = word.split('').map((ch) => {
                const charEl = (
                  <span
                    key={globalCharIndex}
                    className="lch"
                    style={{ '--i': globalCharIndex } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                );
                globalCharIndex++;
                return charEl;
              });

              return (
                <React.Fragment key={wIdx}>
                  {wIdx > 0 && <span className="lsp" />}
                  {chars}
                </React.Fragment>
              );
            })}
          </h1>
          <div className="loader-sweep" />
        </div>

        <div className="loader-counter" id="loaderCounter">
          {Math.max(1, pct)}
        </div>

        <div className="loader-role">
          <span>{PERSONAL_INFO.role}</span>
        </div>

        <div className="loader-bar-wrap">
          <div className="loader-bar">
            <div
              className="loader-bar-fill"
              id="loaderFill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="loader-meta">
            <span>Initializing</span>
            <span id="loaderPct">{pct}%</span>
          </div>
          <div className="loader-status" id="loaderStatus">
            {statusMsg}
          </div>
        </div>
      </div>
    </div>
  );
};
