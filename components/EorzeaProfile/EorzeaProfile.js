import styles from './EorzeaProfile.module.scss';

function EorzeaProfile() {
  return (
    <div className={styles.container}>
      <a
        href="https://dashboard.twitch.tv/extensions/bsdr8tkgubqusuao9ixx6wjyhxy8je-1.1.1"
        target="_blank"
        rel="noreferrer"
        className={styles.panel}
      >
        <div className={styles.image}>
          <img src="/images/ffxiv-screenshot.png" alt="" />
        </div>
        <div className={styles.body}>
          <h2>
            FFXIV Character Profile
            <br />
            Twitch Streamer Panel
          </h2>

          <p className={styles.subtitle}>
            Display your Final Fantasy XIV Endwalker character profile on your stream page.
          </p>

          <div className={styles.cta}>
            Install on Twitch.tv
          </div>
        </div>
      </a>
    </div>
  );
}

export default EorzeaProfile;
