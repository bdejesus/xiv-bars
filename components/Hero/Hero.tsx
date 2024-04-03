/* eslint-disable max-len */
import { useTranslation } from 'next-i18next';
import styles from './Hero.module.scss';

interface Props {
  primary?: boolean
}

export default function Hero({ primary }: Props) {
  const { t } = useTranslation();

  return (
    <div className="container">
      { primary
        ? <h1 className="branding">XIV<b>BARS</b></h1>
        : <h2 className="branding">XIV<b>BARS</b></h2>}

      <div className={styles.description}>
        <p>{t('Global.subtitle')}</p>
        <p>{t('Global.description')}</p>
      </div>
    </div>

  );
}

Hero.defaultProps = {
  primary: true
};
