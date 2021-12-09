import styles from './EorzeaProfile.module.scss';

function EorzeaProfile() {
  return (
    <a
      href="https://dashboard.twitch.tv/extensions/bsdr8tkgubqusuao9ixx6wjyhxy8je-1.1.1"
      target="_blank"
      rel="noreferrer"
      className={`${styles.container} container`}
    >
      <div className={styles.image}>
        <img src="/images/ffxiv-screenshot.png" alt="" />
      </div>
      <div className={styles.body}>
        <h2>FFXIV Profile Twitch Streamer Panel</h2>

        <p className={styles.subtitle}>
          Display your Final Fantasy XIV Endwalker character profile on your stream page.
        </p>

        <div className={styles.cta}>
          Install Now
        </div>
      </div>
    </a>
  );
}

export default EorzeaProfile;
