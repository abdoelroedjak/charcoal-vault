import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__layout">
          <div className="about__text">
            <h2 className="about__headline reveal">
              NOT A FACTORY.
              <br />
              A SUPPLY PARTNER.
            </h2>
            <p className="about__body reveal">
              Charcoal Vault operates as a focused shisha charcoal trading business, connecting
              buyers with reliable supplier-supported products.
            </p>
            <p className="about__body reveal">
              Whether you are testing the market with smaller quantities or building recurring
              supply, our role is simple: make sourcing easier.
            </p>
          </div>
          <div className="about__visual reveal">
            <div className="about__image" aria-label="Warehouse storage environment"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
