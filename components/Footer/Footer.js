import React from 'react';
import PropTypes from 'prop-types';
import BuyMeABeer from 'components/BuyMeABeer';
import styles from './Footer.module.scss';

function Footer({ currentPatch }) {
  const { Name, ExName } = currentPatch;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.version}>
          <a href="https://na.finalfantasyxiv.com/lodestone/topics/detail/c2f8c5ba14d9cfaa09d5aab63c5c2da260eae21a/?utm_source=lodestone&utm_medium=pc_header&utm_campaign=na_5_3patch">
            <img
              className={styles.versionBanner}
              src="https://img.finalfantasyxiv.com/t/de58e70494f03af0b5e341a9a794afa20fdc1642.png?1596700674?1596525244"
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
