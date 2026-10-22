import React from 'react';

export const Hero: React.FC = () => {
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
    <section className="hero" id="hero">
      <div className="hero__content">
        <span className="hero__eyebrow reveal">SHISHA CHARCOAL SUPPLY</span>
        <h1 className="hero__headline reveal">FROM SHELL TO SUPPLY.</h1>
        <p className="hero__body reveal">
          Reliable shisha charcoal supply for lounges, retailers, resellers, and bulk buyers.
        </p>
        <div className="hero__actions reveal">
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, '#contact')}
            className="btn btn--primary"
          >
            REQUEST A QUOTE
          </a>
          <a
            href="#products"
            onClick={(e) => scrollTo(e, '#products')}
            className="btn btn--outline"
          >
            VIEW PRODUCTS
          </a>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__image">
          <img
            src="/img/hero-charcoal.jpg"
            alt="Premium glowing coconut shisha charcoal cubes"
            className="hero__img"
            loading="lazy"
            width={1200}
            height={800}
          />
          <div className="hero__image-overlay"></div>
        </div>
      </div>
    </section>
  );
};
