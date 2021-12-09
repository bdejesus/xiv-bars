import styles from './GlobalHeader.module.scss';

function GlobalHeader() {
  return (
    <div className={styles.container}>
      <a href="/" className={styles.branding}>
        <div className={styles.logo}>
          <img
            src="/icons/favicon-96x96.png"
            alt="XIVBARS Logo"
            height={24}
            width={24}
          />
        </div>
        <div className={styles.title}>XIVBARS</div>
        <div className={styles.subtitle}>
          A Final Fantasy XIV Endwalker Hotbar Planner
        </div>
      </a>
    </div>
  );
}

export default GlobalHeader;
