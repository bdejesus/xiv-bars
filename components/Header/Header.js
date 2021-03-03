/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'lib/I18n/locale/en-US';
import styles from './Header.module.scss';

function Header({ primary }) {
  return (
    <div className="container">
      { primary
        ? <h1>{I18n.Global.title}</h1>
        : <h2>{I18n.Global.title}</h2>}

      <div className={styles.description}>
        <p>{I18n.Global.subtitle}</p>
        <p>{I18n.Global.description}</p>

        <h4>{I18n.Header.title}</h4>
        <p>{I18n.Header.body}</p>
      </div>
    </div>

  );
}

Header.propTypes = {
  primary: PropTypes.bool
};

Header.defaultProps = {
  primary: true
};

export default Header;
