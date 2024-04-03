import { useTranslation } from 'next-i18next';
import styles from './Footer.module.scss';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.logo}>
          <img
            src="/xivbars-logo.svg"
            alt="XIV BARS"
            height={20}
            width={120}
          />
        </div>

        <p>
          <a href="https://github.com/bdejesus/xiv-bars/issues/new/choose">{t('Footer.submit_an_issue')}</a> • <a href="https://github.com/bdejesus/xiv-bars">GitHub</a> • <a href="https://xivapi.com/">{t('Footer.built_with_xivapi')}</a>
        </p>

        <p>{t('Footer.property_of_squenix')}</p>
      </div>
    </footer>
  );
}

export default Footer;
