import React from 'react';

export const WhoWeSupply: React.FC = () => {
  return (
    <section className="section buyers" id="buyers">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title reveal">WHO WE SUPPLY.</h2>
        </div>

        <div className="buyers__grid">
          <div className="buyer-card reveal">
            <div className="buyer-card__icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="16" cy="8" r="5" />
                <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" />
                <path d="M10 22h12" strokeDasharray="2 2" />
              </svg>
            </div>
            <h3 className="buyer-card__title">SHISHA LOUNGES</h3>
          </div>

          <div className="buyer-card reveal">
            <div className="buyer-card__icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="4" y="10" width="24" height="16" rx="1" />
                <path d="M4 16h24" />
                <path d="M12 4v6M20 4v6" />
              </svg>
            </div>
            <h3 className="buyer-card__title">HOOKAH BARS</h3>
          </div>

          <div className="buyer-card reveal">
            <div className="buyer-card__icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 6h20v20H6z" />
                <path d="M6 6l10 10M26 6L16 16" />
                <path d="M16 16v10" />
              </svg>
            </div>
            <h3 className="buyer-card__title">RESELLERS</h3>
          </div>

          <div className="buyer-card reveal">
            <div className="buyer-card__icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="6" y="4" width="20" height="24" rx="1" />
                <path d="M11 10h10M11 15h10M11 20h6" />
              </svg>
            </div>
            <h3 className="buyer-card__title">RETAILERS</h3>
          </div>

          <div className="buyer-card reveal">
            <div className="buyer-card__icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M4 26h24" />
                <path d="M8 26V12l8-6 8 6v14" />
                <path d="M14 26v-8h4v8" />
              </svg>
            </div>
            <h3 className="buyer-card__title">DISTRIBUTORS</h3>
          </div>

          <div className="buyer-card reveal">
            <div className="buyer-card__icon">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="4" y="8" width="24" height="16" rx="1" />
                <path d="M4 14h24M4 20h24M12 8v16M20 8v16" />
              </svg>
            </div>
            <h3 className="buyer-card__title">BULK BUYERS</h3>
          </div>
        </div>
      </div>
    </section>
  );
};
