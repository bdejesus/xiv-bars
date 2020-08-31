/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import siteData from 'config/app.config';
import styles from './styles.module.scss';

function Header({ primary }) {
  return (
    <div className="container">
      { primary
        ? <h1>{siteData.header.title}</h1>
        : <h2>{siteData.header.title}</h2>}

      <div className={styles.description}>
        <p>{siteData.header.subtitle}</p>
        <p>{siteData.global.description}</p>

        <h4>Simulate FFXIV Cross Hotbars for PC or PS4</h4>
        <p>FFXIV WXHB Cross Hotbar Planner/Simulator can be used to simulate hotbars for PC or <abbr title="Playstation 4">PS4</abbr>/Pro. Configurations are shareable using a generated URL so you can share with others.</p>
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
