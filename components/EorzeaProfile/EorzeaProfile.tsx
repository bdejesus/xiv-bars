import I18n from 'lib/I18n/locale/en-US';

import styles from './EorzeaProfile.module.scss';

export function EorzeaProfile() {
  return (
    <div className={`${styles.container} container`}>
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
            {I18n.EorzeaProfile.title}
          </h2>

          <p className={styles.subtitle}>
            {I18n.EorzeaProfile.body}
          </p>

          <div className={styles.cta}>
            {I18n.EorzeaProfile.cta}
          </div>
        </div>
      </a>
    </div>
  );
}

export default EorzeaProfile;
