/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { translateData, localizePath } from 'lib/utils/i18n';
import ExportToMacros from 'components/ExportToMacro';
import Sharing from 'components/Sharing';
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
  const router = useRouter();
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
                  alt={`${translateData('Name', selectedJob, router.locale)}`}
                  height={20}
                  width={20}
                  className="icon"
                />
                {translateData('Abbreviation', selectedJob, router.locale)}
              </Link>
            </li>

            { ['edit', 'show', 'new'].includes(viewAction) && (
              <li className={styles.actionGroup}>
                <Sharing />
                <ExportToMacros />
              </li>
            ) }

            <li className={viewAction !== 'new' ? styles.action : ''}>
              <a
                href={localizePath(`/job/${selectedJob.Abbr}/new`, router.locale)}
                className="button"
                data-active={viewAction === 'new'}
              >
                <Icon id={Icons.ADD} alt={t('GlobalHeader.new_layout')} />
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
