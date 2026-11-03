import React, { useEffect, useState, useRef } from 'react';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
  { label: 'Social', href: '#social' },
];

export const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('#about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const navTabsRef = useRef<HTMLElement | null>(null);

  const moveIndicator = (element: HTMLElement | null) => {
    if (!element || !indicatorRef.current) return;
    indicatorRef.current.style.width = `${element.offsetWidth}px`;
    indicatorRef.current.style.left = `${element.offsetLeft}px`;
  };

  useEffect(() => {
    // Initial indicator positioning
    const activeEl = navTabsRef.current?.querySelector<HTMLElement>(`a[href="${activeTab}"]`);
    moveIndicator(activeEl || null);

    const handleResize = () => {
      const currentActive = navTabsRef.current?.querySelector<HTMLElement>('a.active');
      moveIndicator(currentActive || null);
    };
    window.addEventListener('resize', handleResize);

    // Section observer for active tab on scroll
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            setActiveTab(id);
            const targetEl = navTabsRef.current?.querySelector<HTMLElement>(`a[href="${id}"]`);
            moveIndicator(targetEl || null);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach((s) => s && observer.observe(s));

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [activeTab]);

  const toggleMobileMenu = (open?: boolean) => {
    const nextState = open !== undefined ? open : !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    document.documentElement.style.overflow = nextState ? 'hidden' : '';
  };

  return (
    <>
      <header className="nav">
        <div className="nav-mark">HH</div>
        <nav className="nav-tabs" id="navTabs" ref={navTabsRef}>
          <div className="nav-indicator" id="navIndicator" ref={indicatorRef} />
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={isActive ? 'active' : ''}
                onMouseEnter={(e) => moveIndicator(e.currentTarget)}
                onMouseLeave={() => {
                  const activeEl = navTabsRef.current?.querySelector<HTMLElement>('a.active');
                  moveIndicator(activeEl || null);
                }}
                onClick={() => setActiveTab(item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <a href="#contact" className="nav-cta">
          Hire me
        </a>
        <button
          className={`nav-burger ${mobileMenuOpen ? 'open' : ''}`}
          id="navBurger"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => toggleMobileMenu()}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div id="mobileMenu" className={mobileMenuOpen ? 'open' : ''}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => toggleMobileMenu(false)}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#contact"
          className="mm-cta"
          onClick={() => toggleMobileMenu(false)}
        >
          Hire me
        </a>
      </div>
    </>
  );
};
