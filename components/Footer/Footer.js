import React from 'react';
import PropTypes from 'prop-types';
import BuyMeABeer from 'components/BuyMeABeer';
import styles from './Footer.styles.module.scss';

function Footer({ currentPatch }) {
  const {
    Name, Url, ExName, Banner
  } = currentPatch;

  const baseFFXIVUrl = 'https://na.finalfantasyxiv.com';
  const versionSlug = Url.replace(/[+|.]/gi, '_');
  const patchUrl = `${baseFFXIVUrl}/${ExName.toLowerCase()}${versionSlug}`;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.version}>
          <a href={patchUrl}>
            <img
              className={styles.versionBanner}
              src={Banner}
              alt={Name}
            />
            <div className={styles.versionBody}>
              <b>Current Version</b>
              <h3>Final Fantasy XIV {ExName} {Name}</h3>
            </div>
          </a>
        </div>

        <div className={styles.right}>
          <BuyMeABeer />
          <p>
            <a href="https://github.com/bdejesus/xiv-bars/issues/new">Request a feature or submit a bug report</a> • <a href="https://github.com/bdejesus/xiv-bars">GitHub</a>
          </p>
          <p>
            <a href="https://xivapi.com/">Built with XIVAPI</a>
          </p>
          <p>
            All Final Fantasy XIV content is property of Square Enix Co., LTD
          </p>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  currentPatch: PropTypes.shape({
    Banner: PropTypes.string,
    Name: PropTypes.string,
    ExName: PropTypes.string,
    Url: PropTypes.string
  }).isRequired
};

export default Footer;
