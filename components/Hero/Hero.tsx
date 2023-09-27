/* eslint-disable max-len */
import PropTypes from 'prop-types';
import I18n from 'lib/I18n/locale/en-US';
import styles from './Hero.module.scss';

export function Hero({ primary }: { primary: boolean }) {
  return (
    <div className="container">
      { primary
        ? <h1 className="branding">XIV<b>BARS</b></h1>
        : <h2 className="branding">XIV<b>BARS</b></h2>}

      <div className={styles.description}>
        <p>{I18n.Global.subtitle}</p>
        <p>{I18n.Global.description}</p>
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