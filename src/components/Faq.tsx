import React from 'react';
import { FAQ_ITEMS } from '../data/charcoalData';

export const Faq: React.FC = () => {
  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title reveal">FREQUENTLY ASKED.</h2>
        </div>

        <div className="faq__list">
          {FAQ_ITEMS.map((item, index) => (
            <details className="faq__item reveal" key={index}>
              <summary className="faq__question">
                <span>{item.question}</span>
                <svg
                  className="faq__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="faq__answer">
                <p>
                  {item.answer.includes('subject to change at any time without prior notice') ? (
                    <>
                      {item.answer.split('subject to change at any time without prior notice')[0]}
                      <strong>subject to change at any time without prior notice</strong>
                      {item.answer.split('subject to change at any time without prior notice')[1]}
                    </>
                  ) : (
                    item.answer
                  )}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
