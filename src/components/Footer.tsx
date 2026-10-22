import React from 'react';
import { TARGET_EMAIL, TARGET_WA_NUM, TARGET_WA_DISPLAY } from '../data/charcoalData';

export const Footer: React.FC = () => {
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
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <img src="/img/logo-mark.jpg" alt="Charcoal Vault" className="footer__profile-img" />
            <div>
              <span className="footer__name">CHARCOAL VAULT</span>
              <span className="footer__tagline">SHISHA CHARCOAL SUPPLY</span>
            </div>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <a href="#products" onClick={(e) => scrollTo(e, '#products')}>
              Products
            </a>
            <a href="#about" onClick={(e) => scrollTo(e, '#about')}>
              About
            </a>
            <a href="#faq" onClick={(e) => scrollTo(e, '#faq')}>
              FAQ
            </a>
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')}>
              Contact
            </a>
          </nav>

          <div className="footer__contact">
            <a href={`mailto:${TARGET_EMAIL}`}>{TARGET_EMAIL}</a>
            <span className="footer__contact-sep" aria-hidden="true">
              ·
            </span>
            <a
              href={`https://wa.me/${TARGET_WA_NUM}?text=Hello%20Charcoal%20Vault%2C%20I%20would%20like%20to%20inquire%20about%20shisha%20charcoal%20supply.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {TARGET_WA_DISPLAY}
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Charcoal Vault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
