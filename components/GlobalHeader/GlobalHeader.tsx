/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { translateData } from 'lib/utils/i18n';
import Link from 'next/link';
import UserNav from 'components/UserNav';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';
import JobSelect from 'components/JobSelect';
import DuplicateLayout from 'components/ControlBar/DuplicateLayout';

import type { ClassJobProps } from 'types/ClassJob';

import styles from './GlobalHeader.module.scss';

interface Props {
  selectedJob?: ClassJobProps
}

export function GlobalHeader({ selectedJob }:Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { viewData, viewAction } = useAppState();
  const { title, id } = viewData || {};

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
              <JobSelect className={styles.jobSelect} />

              <Link
                href={`/job/${selectedJob.Abbr}`}
                className={`${styles.selectedJob} button btn-alt`}
              >
                <img
                  src={`/jobIcons${selectedJob.Icon}`}
                  alt={`${translateData('Name', selectedJob, locale)}`}
                  height={20}
                  width={20}
                  className="icon"
                />
                {translateData('Abbreviation', selectedJob, locale)}
              </Link>
            </li>

            {title && (
              <li className={[styles.titleSegment, styles.active].join(' ')}>
                <span className={styles.title}>{title}</span>
              </li>
            )}

            <li className={viewAction !== 'new' ? styles.action : ''}>
              <a
                href={`/job/${selectedJob.Abbr}/new`}
                className="button"
                data-active={viewAction === 'new'}
              >
                <Icon id={Icons.ADD} alt="New Layout Icon" />
                <span className="btn-label">{t('GlobalHeader.new_layout')}</span>
              </a>

              { id && <DuplicateLayout /> }
            </li>
          </ol>
        </nav>
      )}

      <UserNav className={styles.userNav} />

    </div>
  );
}

GlobalHeader.defaultProps = {
  selectedJob: undefined
};

export default GlobalHeader;
