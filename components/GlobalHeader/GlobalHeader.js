import styles from './GlobalHeader.module.scss';

function GlobalHeader() {
  return (
    <div className={styles.container}>
      <a href="/" className={styles.branding}>
        <img
          src="/icons/favicon-96x96.png"
          alt="XIVBARS Logo"
          height={24}
          width={24}
        />
        <b className={styles.title}>XIVBARS</b>
        <span className={styles.subTitle}>
          A Final Fantasy XIV Endwalker Hotbar Planner
        </span>
      </a>
    </div>
  );
}

export default GlobalHeader;
