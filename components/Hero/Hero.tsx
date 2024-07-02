/* eslint-disable max-len */
import { useTranslation } from 'next-i18next';
import styles from './Hero.module.scss';

interface Props {
  primary?: boolean
}

export default function Hero({ primary = true }: Props) {
  const { t } = useTranslation();

  return (
    <div className="container">
      { primary
        ? <h1 className="branding">XIV<b>BARS</b></h1>
        : <h2 className="branding">XIV<b>BARS</b></h2>}

      <div className={styles.description}>
        <p className="text-xl">{t('Global.subtitle')}</p>
        <p>{t('Global.description')}</p>
      </div>
    </div>

  );
}
