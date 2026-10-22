import React from 'react';
import { WHY_POINTS } from '../data/charcoalData';

export const WhyCharcoal: React.FC = () => {
  return (
    <section className="section why" id="why">
      <div className="container">
        <h2 className="why__headline reveal">
          BUILT FOR BUYERS
          <br />
          WHO NEED CONSISTENCY.
        </h2>

        <div className="why__grid">
          {WHY_POINTS.map((point) => (
            <div className="why__point reveal" key={point.number}>
              <span className="why__number">{point.number}</span>
              <h3 className="why__point-title">{point.title}</h3>
              <p className="why__point-body">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
