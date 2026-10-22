import React from 'react';

export const Products: React.FC = () => {
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
    <section className="section products" id="products">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title reveal">THE CHARCOAL WE SUPPLY.</h2>
          <p className="section__subtitle reveal">
            Selected formats for businesses that need dependable shisha charcoal supply.
          </p>
        </div>

        <div className="products__grid">
          {/* Product 01 */}
          <article className="product-card reveal">
            <div className="product-card__image">
              <img
                src="/img/cube-charcoal.jpg"
                alt="Premium coconut cube charcoal glowing with heat"
                className="product-card__img"
              />
            </div>
            <div className="product-card__content">
              <span className="product-card__number">01</span>
              <h3 className="product-card__title">CUBE CHARCOAL</h3>
              <p className="product-card__desc">
                Premium coconut shell charcoal for everyday shisha service.
              </p>
              <dl className="product-card__specs">
                <div className="spec-row">
                  <dt>Shape</dt>
                  <dd>Cube</dd>
                </div>
                <div className="spec-row">
                  <dt>Material</dt>
                  <dd>100% Coconut Shell</dd>
                </div>
                <div className="spec-row">
                  <dt>Ash Content</dt>
                  <dd>1.79% (ASTM D1762)</dd>
                </div>
                <div className="spec-row">
                  <dt>Calorific Value</dt>
                  <dd>7,211+ Kcal/kg</dd>
                </div>
                <div className="spec-row">
                  <dt>Use</dt>
                  <dd>Shisha / Hookah</dd>
                </div>
                <div className="spec-row">
                  <dt>Size</dt>
                  <dd>Available on request</dd>
                </div>
              </dl>
              <div className="product-card__price">
                <span className="product-card__price-label">CURRENT PRICE ON REQUEST</span>
                <span className="product-card__price-ref">
                  Supplier pricing from USD 1,450 / MT* (Subject to market change)
                </span>
                <a
                  href="#pricing"
                  onClick={(e) => scrollTo(e, '#pricing')}
                  className="product-card__price-link"
                >
                  View reference pricing &darr;
                </a>
              </div>
            </div>
          </article>

          {/* Product 02 */}
          <article className="product-card reveal">
            <div className="product-card__image">
              <img
                src="/img/bulk-supply.jpg"
                alt="Commercial bulk shisha charcoal supply and lounge service"
                className="product-card__img product-card__img--bulk"
              />
            </div>
            <div className="product-card__content">
              <span className="product-card__number">02</span>
              <h3 className="product-card__title">BULK SUPPLY</h3>
              <p className="product-card__desc">
                For lounges, retailers, resellers and recurring buyers.
              </p>
              <dl className="product-card__specs">
                <div className="spec-row">
                  <dt>Packaging</dt>
                  <dd>Carton / Bulk</dd>
                </div>
                <div className="spec-row">
                  <dt>Order</dt>
                  <dd>Based on requirement</dd>
                </div>
                <div className="spec-row">
                  <dt>Supply</dt>
                  <dd>Recurring</dd>
                </div>
                <div className="spec-row">
                  <dt>Pricing</dt>
                  <dd>Based on volume &amp; packaging</dd>
                </div>
              </dl>
              <div className="product-card__price">
                <span className="product-card__price-label">CURRENT PRICE ON REQUEST</span>
                <span className="product-card__price-ref">
                  Request latest quotation (prices subject to change)
                </span>
                <a
                  href="#contact"
                  onClick={(e) => scrollTo(e, '#contact')}
                  className="product-card__price-link"
                >
                  Request a quote &rarr;
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
