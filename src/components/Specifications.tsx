import React from 'react';
import { CV_LAB_SPECS, COMMERCIAL_PARAMS } from '../data/charcoalData';

export const Specifications: React.FC = () => {
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
    <section className="section specs" id="specs">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title reveal">KNOW WHAT YOU'RE BUYING.</h2>
          <p className="section__subtitle reveal">
            Independent proximate laboratory test results and standard trading parameters for Charcoal
            Vault coconut shell shisha charcoal.
          </p>
        </div>

        {/* Key Performance Highlights */}
        <div className="specs__badges reveal">
          <div className="spec-badge">
            <span className="spec-badge__value">1.79%</span>
            <span className="spec-badge__label">Ash Content (Wet Basis)</span>
          </div>
          <div className="spec-badge">
            <span className="spec-badge__value">7,211+</span>
            <span className="spec-badge__label">Kcal/kg Calorific Value</span>
          </div>
          <div className="spec-badge">
            <span className="spec-badge__value">77.2%</span>
            <span className="spec-badge__label">Fixed Carbon (Wet)</span>
          </div>
          <div className="spec-badge">
            <span className="spec-badge__value">ASTM</span>
            <span className="spec-badge__label">Tested Standards</span>
          </div>
        </div>

        {/* Laboratory Analysis Table */}
        <div className="specs__lab-block reveal">
          <div className="specs__block-header">
            <div>
              <h3 className="specs__block-title">PROXIMATE LABORATORY ANALYSIS</h3>
              <span className="specs__block-subtitle">Supplier-Provided Test Report Data</span>
            </div>
            <span className="specs__block-tag">ASTM TEST METHODS</span>
          </div>

          <div className="specs__table-responsive">
            <table className="specs__lab-table">
              <thead>
                <tr>
                  <th rowSpan={2} className="col-param">
                    Parameter
                  </th>
                  <th rowSpan={2} className="col-unit">
                    Unit
                  </th>
                  <th colSpan={2} className="col-results">
                    Results
                  </th>
                  <th rowSpan={2} className="col-method">
                    Method
                  </th>
                </tr>
                <tr className="sub-head">
                  <th className="col-sub">Wet Basis</th>
                  <th className="col-sub">Dry Basis</th>
                </tr>
              </thead>
              <tbody>
                {CV_LAB_SPECS.map((spec) => (
                  <tr key={spec.parameter}>
                    <td className="cell-param">{spec.parameter}</td>
                    <td className="cell-unit">{spec.unit}</td>
                    <td className="cell-val">
                      {typeof spec.wetBasis === 'number'
                        ? spec.wetBasis.toLocaleString(undefined, {
                            minimumFractionDigits: spec.wetBasis % 1 !== 0 ? 2 : 0,
                          })
                        : spec.wetBasis}
                    </td>
                    <td className={`cell-val ${spec.dryBasis === null ? 'cell-dash' : ''}`}>
                      {spec.dryBasis !== null
                        ? spec.dryBasis.toLocaleString(undefined, {
                            minimumFractionDigits: spec.dryBasis % 1 !== 0 ? 2 : 0,
                          })
                        : '—'}
                    </td>
                    <td className="cell-method">{spec.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commercial & Supply Specifications Table */}
        <div className="specs__commercial-block reveal">
          <h3 className="specs__commercial-title">COMMERCIAL &amp; SUPPLY PARAMETERS</h3>
          <div className="specs__table">
            {COMMERCIAL_PARAMS.map((param) => (
              <div className="specs__row" key={param.label}>
                <span className="specs__label">{param.label}</span>
                <span className="specs__value">{param.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="specs__cta reveal">
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, '#contact')}
            className="btn btn--primary"
          >
            ASK FOR CURRENT SPECIFICATIONS &amp; COA
          </a>
        </div>
      </div>
    </section>
  );
};
