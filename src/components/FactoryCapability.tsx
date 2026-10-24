import React from 'react';
import { FACTORY_CAPABILITIES } from '../data/charcoalData';

export const FactoryCapability: React.FC = () => {
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
    <section className="section capability" id="capability">
      <div className="container">
        <div className="section__header">
          <span className="hero__eyebrow reveal">PRODUCTION &amp; SUPPLY INFRASTRUCTURE</span>
          <h2 className="section__title reveal">FACTORY CAPABILITY.</h2>
          <p className="section__subtitle reveal">
            Charcoal Vault partners with dedicated supplier manufacturing facilities in Indonesia to secure raw material reserves, continuous oven drying, and high-standard export packaging.
          </p>
        </div>

        {/* Warehouse & Stock Highlights */}
        <div className="capability__stats reveal">
          {FACTORY_CAPABILITIES.warehouse.map((item) => (
            <div className="capability__stat-card" key={item.label}>
              <span className="capability__stat-label">{item.label}</span>
              <span className="capability__stat-value">{item.value}</span>
              <p className="capability__stat-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Operational Capabilities Grid */}
        <div className="capability__grid">
          {/* Card 1: Production Machinery */}
          <div className="capability__card reveal">
            <div className="capability__card-title">
              <span>PRODUCTION CAPACITY</span>
              <span className="capability__card-badge">MANUFACTURING</span>
            </div>
            <p className="capability__card-sub">
              <strong>Machinery:</strong> {FACTORY_CAPABILITIES.production.machinery}
            </p>
            <div className="capability__rates">
              {FACTORY_CAPABILITIES.production.rates.map((rate) => (
                <div className="capability__rate-item" key={rate.period}>
                  <span className="capability__rate-period">{rate.period}</span>
                  <span className="capability__rate-val">{rate.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Drying Machine */}
          <div className="capability__card reveal">
            <div className="capability__card-title">
              <span>DRYING MACHINE CAPACITY</span>
              <span className="capability__card-badge">OVEN CURING</span>
            </div>
            <p className="capability__card-sub">
              <strong>Equipment:</strong> {FACTORY_CAPABILITIES.drying.machinery}
            </p>
            <div className="capability__rates">
              {FACTORY_CAPABILITIES.drying.rates.map((rate) => (
                <div className="capability__rate-item" key={rate.period}>
                  <span className="capability__rate-period">{rate.period}</span>
                  <span className="capability__rate-val">{rate.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Packaging Capacity */}
          <div className="capability__card reveal">
            <div className="capability__card-title">
              <span>PACKAGING CAPACITY</span>
              <span className="capability__card-badge">OUTPUT RATE</span>
            </div>
            <p className="capability__card-sub">
              Continuous packaging assembly line for innerboxes and masterbox cartons.
            </p>
            <div className="capability__rates">
              {FACTORY_CAPABILITIES.packaging.rates.map((rate) => (
                <div className="capability__rate-item" key={rate.period}>
                  <span className="capability__rate-period">{rate.period}</span>
                  <span className="capability__rate-val">{rate.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Inner Plastic & Box Capability */}
          <div className="capability__card reveal">
            <div className="capability__card-title">
              <span>INNER PLASTIC &amp; BOX CAPABILITY</span>
              <span className="capability__card-badge">PACKAGING STANDARDS</span>
            </div>
            <div className="capability__features">
              <div className="capability__feature-item">
                <span className="capability__feature-name">Inner Plastic</span>
                <span className="capability__feature-val">Machine Sealed • Printed (By request) • Silica Gel (By request)</span>
              </div>
              <div className="capability__feature-item">
                <span className="capability__feature-name">Inner Box</span>
                <span className="capability__feature-val">345 E–Flute (Duplex) 125 Medium E–Flute + 125 Kraft (Machine Sealed)</span>
              </div>
              <div className="capability__feature-item">
                <span className="capability__feature-name">Master Box</span>
                <span className="capability__feature-val">Single Wall, One Printing Color (As requested)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="capability__cta reveal">
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, '#contact')}
            className="btn btn--primary"
          >
            DISCUSS PRODUCTION &amp; CONTAINER ALLOCATION &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
