/* eslint-disable max-len */
import I18n from 'lib/I18n/locale/en-US';
import styles from './Hero.module.scss';

interface Props {
  primary?: boolean
}

export default function Hero({ primary }: Props) {
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

Hero.defaultProps = {
  primary: true
};
