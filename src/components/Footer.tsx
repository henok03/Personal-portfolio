import React from 'react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      <div
        className="wrap"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <span>© 2026 Eyob Tesfaye. Built by hand.</span>
        <button
          type="button"
          onClick={scrollToTop}
          style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', font: 'inherit' }}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
};
