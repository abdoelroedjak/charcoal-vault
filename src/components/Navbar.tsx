import React, { useState, useEffect } from 'react';

interface NavbarProps {
  isScrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navElement = document.getElementById('nav');
      const navHeight = navElement ? navElement.offsetHeight : 0;
      const targetPos = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`nav ${isScrolled ? 'is-scrolled' : ''}`} id="nav">
        <div className="nav__inner">
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, '#')}
            className="nav__logo"
            aria-label="Charcoal Vault Home"
          >
            <img src="/img/logo-mark.png" alt="Charcoal Vault" className="nav__profile-img" />
            <span className="nav__brand">CHARCOAL VAULT</span>
          </a>

          <ul className="nav__links" id="navLinks">
            <li>
              <a href="#products" onClick={(e) => handleLinkClick(e, '#products')}>
                Products
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>
                About
              </a>
            </li>
            <li>
              <a href="#capability" onClick={(e) => handleLinkClick(e, '#capability')}>
                Capability
              </a>
            </li>
            <li>
              <a href="#how-we-supply" onClick={(e) => handleLinkClick(e, '#how-we-supply')}>
                How We Supply
              </a>
            </li>
            <li>
              <a href="#faq" onClick={(e) => handleLinkClick(e, '#faq')}>
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>
                Contact
              </a>
            </li>
          </ul>

          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="nav__cta"
          >
            REQUEST PRICE
          </a>

          <button
            className={`nav__toggle ${mobileMenuOpen ? 'is-active' : ''}`}
            id="navToggle"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'is-open' : ''}`} id="mobileNav">
        <ul className="mobile-nav__links">
          <li>
            <a href="#products" onClick={(e) => handleLinkClick(e, '#products')}>
              Products
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>
              About
            </a>
          </li>
          <li>
            <a href="#capability" onClick={(e) => handleLinkClick(e, '#capability')}>
              Capability
            </a>
          </li>
          <li>
            <a href="#how-we-supply" onClick={(e) => handleLinkClick(e, '#how-we-supply')}>
              How We Supply
            </a>
          </li>
          <li>
            <a href="#faq" onClick={(e) => handleLinkClick(e, '#faq')}>
              FAQ
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>
              Contact
            </a>
          </li>
        </ul>
        <a
          href="#contact"
          onClick={(e) => handleLinkClick(e, '#contact')}
          className="mobile-nav__cta"
        >
          REQUEST A QUOTE
        </a>
      </div>
    </>
  );
};
