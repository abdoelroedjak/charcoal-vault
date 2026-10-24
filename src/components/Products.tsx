import React from 'react';
import { CATALOG_PRODUCTS } from '../data/charcoalData';

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

  const handleInquireProduct = (e: React.MouseEvent<HTMLAnchorElement>, productId: string) => {
    e.preventDefault();
    const selectElem = document.querySelector('select[name="product"]') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = productId;
      selectElem.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      const navElem = document.getElementById('nav');
      const navHeight = navElem ? navElem.offsetHeight : 0;
      const targetPos = contactElem.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  };

  return (
    <section className="section products" id="products">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title reveal">OUR PRODUCT CATALOG.</h2>
          <p className="section__subtitle reveal">
            Premium coconut shell charcoal briquettes in calibrated sizes for shisha lounges, hookah bars, distributors, and bulk buyers.
          </p>
        </div>

        {/* 3-Card Grid for Flagship Products */}
        <div className="products__grid products__grid--3col">
          {CATALOG_PRODUCTS.map((prod) => (
            <article className="product-card reveal" key={prod.id}>
              <div className="product-card__image">
                <img
                  src={prod.image}
                  alt={`${prod.name} - ${prod.contains} (${prod.size})`}
                  className="product-card__img"
                  loading="lazy"
                  width={600}
                  height={450}
                />
                <span className={`product-card__floating-badge product-card__floating-badge--${prod.colorTheme}`}>
                  {prod.badge}
                </span>
              </div>
              <div className="product-card__content">
                <div className="product-card__badge-row">
                  <span className="product-card__number">{prod.code}</span>
                  <span className={`product-card__tag product-card__tag--${prod.colorTheme}`}>
                    {prod.sizeBadge}
                  </span>
                </div>
                <h3 className="product-card__title">{prod.name}</h3>
                <p className="product-card__desc">{prod.description}</p>
                <dl className="product-card__specs">
                  {prod.specs.map((spec) => (
                    <div className="spec-row" key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="product-card__price">
                  <span className="product-card__price-label">1KG BOX PACKAGING</span>
                  <span className="product-card__price-ref">
                    Masterbox 10kg • EXW from USD 1,475/MT • FOB from USD 1,500/MT
                  </span>
                  <div className="product-card__actions">
                    <a
                      href="#contact"
                      onClick={(e) => handleInquireProduct(e, prod.id)}
                      className="btn btn--primary btn--full product-card__btn"
                    >
                      INQUIRE {prod.name}
                    </a>
                    <a
                      href="#pricing"
                      onClick={(e) => scrollTo(e, '#pricing')}
                      className="product-card__price-link"
                    >
                      View reference pricing &darr;
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bulk & Custom OEM Supply Banner */}
        <div className="products__bulk-banner reveal">
          <div className="products__bulk-banner-visual">
            <img
              src="/img/bulk-supply.jpg"
              alt="Commercial bulk shisha charcoal supply and lounge service"
              className="products__bulk-banner-img"
              loading="lazy"
              width={600}
              height={400}
            />
          </div>
          <div className="products__bulk-banner-content">
            <span className="product-card__number">04</span>
            <h3 className="products__bulk-banner-title">BULK &amp; PRIVATE LABEL (OEM) SUPPLY</h3>
            <p className="products__bulk-banner-desc">
              Looking for custom dimensions (22mm, 26mm, 27mm, Hexa), plain masterboxes, or fully branded retail boxes with your own artwork? We coordinate container-scale shipments (18 MT MOQ) tailored to your brand specifications.
            </p>
            <div className="products__bulk-banner-tags">
              <span className="products__bulk-tag">1x 20ft FCL (18 MT MOQ)</span>
              <span className="products__bulk-tag">Custom Inner Box 1kg</span>
              <span className="products__bulk-tag">Masterbox 10kg Doublewall</span>
              <span className="products__bulk-tag">Machine-Sealed Inner Plastic</span>
            </div>
            <div className="products__bulk-banner-actions">
              <a
                href="#contact"
                onClick={(e) => handleInquireProduct(e, 'bulk-supply')}
                className="btn btn--primary"
              >
                REQUEST BULK / OEM QUOTE &rarr;
              </a>
              <a
                href="#how-we-supply"
                onClick={(e) => scrollTo(e, '#how-we-supply')}
                className="btn btn--outline"
              >
                HOW WE SUPPLY
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
