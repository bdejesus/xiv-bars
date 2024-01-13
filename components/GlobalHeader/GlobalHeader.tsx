/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from 'next/link';
import UserNav from 'components/UserNav';
import { useAppState } from 'components/App/context';
import Icon from 'components/Icon';
import styles from './GlobalHeader.module.scss';

export function GlobalHeader() {
  const { selectedJob, title, viewAction } = useAppState();

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
              <Link
                href={`/job/${selectedJob.Abbr}`}
                className={[
                  styles.selectedJob,
                  'btn',
                  `${viewAction === 'list' ? 'btn-alt' : ''}`
                ].join(' ')}
              >
                <img
                  src={`/jobIcons${selectedJob.Icon}`}
                  alt=""
                  height={20}
                  width={20}
                />
                {selectedJob.Abbr}
              </Link>

              { /* Layout Index Nav Item
                <Link
                  href={`/job/${selectedJob.Abbr}`}
                  className={[
                    styles.selectedJob,
                    'btn',
                    `${viewAction === 'list' ? styles.active : ''}`
                  ].join(' ')}
                  data-active={viewAction === 'list'}
                >
                  Layouts
                </Link>
              */ }

            </li>

            {title && (
              <li className={[styles.titleSegment, styles.active].join(' ')}>
                <span className={styles.title}>{title}</span>
              </li>
            )}

            <li className={viewAction !== 'new' ? styles.action : ''}>
              <a
                href={`/job/${selectedJob.Abbr}/new`}
                className="btn"
                data-active={viewAction === 'new'}
              >
                { viewAction !== 'new' && <Icon id="add" title="New Layout Icon" />}
                New Layout
              </a>
            </li>
          </ol>
        </nav>
      )}

      <UserNav />
    </div>
  );
}

export default GlobalHeader;
