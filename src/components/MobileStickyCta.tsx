import React from 'react';

interface MobileStickyCtaProps {
  isVisible: boolean;
}

export const MobileStickyCta: React.FC<MobileStickyCtaProps> = ({ isVisible }) => {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navElement = document.getElementById('nav');
      const navHeight = navElement ? navElement.offsetHeight : 0;
      const targetPos = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  };

  return (
    <div className={`mobile-cta ${isVisible ? 'is-visible' : ''}`} id="mobileCta">
      <a
        href="#contact"
        onClick={(e) => scrollTo(e, '#contact')}
        className="btn btn--primary btn--full"
      >
        REQUEST A QUOTE
      </a>
    </div>
  );
};
