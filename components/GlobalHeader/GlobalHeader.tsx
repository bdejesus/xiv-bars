/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from 'next/link';
import UserNav from 'components/UserNav';
import { useAppState } from 'components/App/context';
import styles from './GlobalHeader.module.scss';

export function GlobalHeader() {
  const { selectedJob, viewData } = useAppState() || null;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.branding}>
        <div className={styles.logo}>
          <img
            src="/xivbars-logo.svg"
            alt="XIV BARS"
            height={20}
            width={120}
          />
        </div>
      </Link>

      { selectedJob && (
        <nav className={styles.globalNav}>
          <ol>
            <li>
              <Link href={`/job/${selectedJob.Abbr}`}>
                <img
                  src={`/jobIcons${selectedJob.Icon}`}
                  alt=""
                  height={24}
                  width={24}
                />
                {selectedJob.Name}
              </Link>
            </li>

            {viewData?.title
              ? (
                <li className={styles.titleSegment}>
                  <span className={styles.title}>{viewData.title}</span>
                </li>
              )
              : (
                <li>
                  <a href={`/job/${selectedJob.Abbr}/new`}>
                    <span className="newIcon">+</span> NEW LAYOUT
                  </a>
                </li>
              )}

          </ol>
        </nav>
      )}

      <UserNav />
    </div>
  );
}

export default GlobalHeader;
