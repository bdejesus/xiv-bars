/* eslint-disable jsx-a11y/anchor-is-valid */

import PropTypes from 'prop-types';
import Link from 'next/link';
import UserNav from 'components/UserNav';
import styles from './GlobalHeader.module.scss';

export function GlobalHeader({ selectedJob }) {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.branding}>
        <div className={styles.logo}>
          <img
            src="/icons/favicon-96x96.png"
            alt="XIVBARS Logo"
            height={24}
            width={24}
          />
        </div>
        <div className={`${styles.title} branding`}>
          XIV<b>BARS</b>
        </div>
      </Link>

      { selectedJob && (
        <nav className={styles.globalNav}>
          <ol>
            <li>
              {selectedJob.Icon}
              {selectedJob.Abbr}
            </li>
          </ol>
        </nav>
      )}

      <UserNav />
    </div>
  );
}

GlobalHeader.propTypes = {
  selectedJob: PropTypes.shape()
};

GlobalHeader.defaultProps = {
  selectedJob: undefined
};

export default GlobalHeader;
