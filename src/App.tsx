import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InfoStrip } from './components/InfoStrip';
import { Products } from './components/Products';
import { Pricing } from './components/Pricing';
import { WhyCharcoal } from './components/WhyCharcoal';
import { HowWeSupply } from './components/HowWeSupply';
import { WhoWeSupply } from './components/WhoWeSupply';
import { About } from './components/About';
import { FactoryCapability } from './components/FactoryCapability';
import { Specifications } from './components/Specifications';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MobileStickyCta } from './components/MobileStickyCta';
import {
  INITIAL_PRICING,
  CV_LAB_SPECS,
  computeFinalPrices,
  getPriceDisplay,
} from './data/charcoalData';

export const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  // Expose pricing & specs to global window for console/inspection compatibility
  useEffect(() => {
    window.__CV_PRICING = INITIAL_PRICING;
    window.__CV_LAB_SPECS = CV_LAB_SPECS;
    window.__CV_computePrices = () => computeFinalPrices(INITIAL_PRICING);
    window.__CV_getPriceDisplay = getPriceDisplay;
  }, []);

  // Handle scroll events for sticky nav and mobile CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const heroElement = document.getElementById('hero');
      const heroHeight = heroElement ? heroElement.offsetHeight : 600;
      setShowMobileCta(scrollY > heroHeight * 0.7);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const parent = entry.target.parentElement;
              const siblings = parent ? parent.querySelectorAll('.reveal') : [];
              let delay = 0;

              siblings.forEach((sibling) => {
                if (sibling === entry.target) {
                  (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
                }
                if (!sibling.classList.contains('is-visible')) {
                  delay += 80;
                }
              });

              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      reveals.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    } else {
      reveals.forEach((el) => el.classList.add('is-visible'));
    }
  }, []);

  return (
    <>
      <Navbar isScrolled={isScrolled} />
      <main>
        <Hero />
        <InfoStrip />
        <Products />
        <Pricing />
        <WhyCharcoal />
        <HowWeSupply />
        <WhoWeSupply />
        <About />
        <FactoryCapability />
        <Specifications />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileStickyCta isVisible={showMobileCta} />
    </>
  );
};

export default App;
