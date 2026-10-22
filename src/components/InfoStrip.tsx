import React from 'react';

export const InfoStrip: React.FC = () => {
  return (
    <div className="info-strip">
      <div className="info-strip__inner">
        <span className="info-strip__item reveal">B2B SUPPLY</span>
        <span className="info-strip__divider" aria-hidden="true"></span>
        <span className="info-strip__item reveal">CONSISTENT QUALITY</span>
        <span className="info-strip__divider" aria-hidden="true"></span>
        <span className="info-strip__item reveal">FLEXIBLE ORDERS</span>
        <span className="info-strip__divider" aria-hidden="true"></span>
        <span className="info-strip__item reveal">DIRECT SOURCING</span>
      </div>
    </div>
  );
};
