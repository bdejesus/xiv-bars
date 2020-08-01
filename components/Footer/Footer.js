import React from 'react';
import BuyMeABeer from 'components/BuyMeABeer';

function Footer() {
  return (
    <div className="container">
      <div>
        <BuyMeABeer />
      </div>
      <p>
        <a href="https://github.com/bdejesus/xiv-bars">GitHub</a>
      </p>
      <p>
        <a href="https://xivapi.com/">Powered by XIVAPI</a>
      </p>
      <p>
        All Final Fantasy XIV content is property of Square Enix Co., LTD
      </p>
    </div>
  );
}

export default Footer;
