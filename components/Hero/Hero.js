/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'lib/I18n/locale/en-US';
import styles from './Hero.module.scss';

function Hero({ primary }) {
  return (
    <div className="container">
      { primary
        ? <h1>{I18n.Global.title}</h1>
        : <h2>{I18n.Global.title}</h2>}

      <div className={styles.description}>
        <p>{I18n.Global.subtitle}</p>
        <p>{I18n.Global.description}</p>

        <h2 className="text-xl">{I18n.Header.title}</h2>
        <p>{I18n.Header.body}</p>
      </div>
    </div>

  );
}

Hero.propTypes = {
  primary: PropTypes.bool
};

Hero.defaultProps = {
  primary: true
};

export default Hero;
