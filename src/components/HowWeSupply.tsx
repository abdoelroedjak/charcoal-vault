import React from 'react';
import { SUPPLY_STEPS } from '../data/charcoalData';

export const HowWeSupply: React.FC = () => {
  return (
    <section className="section process" id="how-we-supply">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title reveal">HOW WE SUPPLY.</h2>
        </div>

        <div className="process__steps">
          {SUPPLY_STEPS.map((step) => (
            <div className="process__step reveal" key={step.number}>
              <span className="process__number">{step.number}</span>
              <div className="process__line" aria-hidden="true"></div>
              <p className="process__text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
