import React from 'react';
import { INITIAL_PRICING } from '../data/charcoalData';

export const Pricing: React.FC = () => {
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
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title reveal">SUPPLIER REFERENCE PRICING.</h2>
          <p className="section__subtitle reveal">
            All prices are per metric ton (1,000 kg). Minimum order quantity (MOQ): 18 MT.
            Reference figures only — prices are subject to change at any time based on raw material
            market fluctuations.
          </p>
        </div>

        <div className="pricing__grid">
          {/* EXW */}
          <div className="pricing__block reveal">
            <div className="pricing__block-header">
              <h3 className="pricing__term">{INITIAL_PRICING.terms.EXW.label}</h3>
              <span className="pricing__term-desc">{INITIAL_PRICING.terms.EXW.description.split('—')[0].trim()}</span>
            </div>
            <div className="pricing__table">
              <div className="pricing__row pricing__row--head">
                <span className="pricing__cell pricing__cell--pkg">PACKAGING</span>
                <span className="pricing__cell pricing__cell--price">REFERENCE PRICE</span>
              </div>
              {INITIAL_PRICING.terms.EXW.options.map((option) => (
                <div className="pricing__row" key={option.id}>
                  <span className="pricing__cell pricing__cell--pkg">{option.packaging}</span>
                  <span className="pricing__cell pricing__cell--price">
                    USD {option.supplierPrice.toLocaleString()} / MT
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FOB */}
          <div className="pricing__block reveal">
            <div className="pricing__block-header">
              <h3 className="pricing__term">{INITIAL_PRICING.terms.FOB.label}</h3>
              <span className="pricing__term-desc">{INITIAL_PRICING.terms.FOB.description.split('—')[0].trim()}</span>
            </div>
            <div className="pricing__table">
              <div className="pricing__row pricing__row--head">
                <span className="pricing__cell pricing__cell--pkg">PACKAGING</span>
                <span className="pricing__cell pricing__cell--price">REFERENCE PRICE</span>
              </div>
              {INITIAL_PRICING.terms.FOB.options.map((option) => (
                <div className="pricing__row" key={option.id}>
                  <span className="pricing__cell pricing__cell--pkg">{option.packaging}</span>
                  <span className="pricing__cell pricing__cell--price">
                    USD {option.supplierPrice.toLocaleString()} / MT
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pricing__footer reveal">
          <p className="pricing__disclaimer">{INITIAL_PRICING.disclaimer}</p>
          <div className="pricing__ref-note">
            <span>Supplier pricing available from USD {INITIAL_PRICING.referencePrice.amount.toLocaleString()} / MT* (MOQ: 18 MT)</span>
            <span className="pricing__ref-asterisk">
              *EXW, Goods Only + Inner Plastic. Minimum order quantity: 18 Metric Tons (18 MT).
              Subject to current raw material pricing.
            </span>
          </div>
          <div className="pricing__notice">
            <svg
              className="pricing__notice-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="pricing__notice-text">
              <strong>PRICE NOTICE:</strong> Coconut shell raw material costs fluctuate based on
              harvest yield and market conditions. All rates shown are reference figures and{' '}
              <strong>subject to change at any time without prior notice</strong>. Contact us for
              today's live binding quotation.
            </div>
          </div>
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, '#contact')}
            className="btn btn--primary"
          >
            REQUEST THE LATEST QUOTATION
          </a>
        </div>
      </div>
    </section>
  );
};
