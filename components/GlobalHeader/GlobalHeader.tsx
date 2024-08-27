/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { localizePath } from 'lib/utils/i18n.mjs';
import ExportToMacros from 'components/ExportToMacro';
import Sharing from 'components/Sharing';
import UserNav from 'components/UserNav';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';
import JobSelect from 'components/JobSelect';
import ClassJob from 'components/ClassJob';
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
  const { id } = viewData || {};

  return (
    <div className={styles.container}>
      <a href={localizePath('/', router.locale)} className={styles.branding}>
        <div className={styles.logo}>
          <img
            src="/xivbars-logo.svg"
            alt="XIV BARS"
            height={20}
            width={120}
          />
        </div>
      </a>

      { selectedJob && (
        <nav className={styles.globalNav}>
          <ol>
            <li>
              <JobSelect className={styles.jobSelect} />
              <ClassJob
                href={`/job/${selectedJob.Abbr}`}
                job={selectedJob}
                name={false}
                className={`button ${styles.selectedJob} list`}
              />
            </li>

            <li className={viewAction !== 'new' ? styles.action : styles.actionGroup}>
              <a
                href={localizePath(`/job/${selectedJob.Abbr}/new`, router.locale)}
                className="button btn-primary"
                data-title={t('GlobalHeader.new_layout')}
              >
                <Icon id={Icons.ADD} alt={t('GlobalHeader.new_layout')} />
                <span className="btn-label">{t('GlobalHeader.new_layout')}</span>
              </a>

              { id && <DuplicateLayout /> }
            </li>

            { ['edit', 'show', 'new'].includes(viewAction as string) && (
              <li className={styles.actionGroup}>
                <Sharing />
                <ExportToMacros />
              </li>
            ) }
          </ol>
        </nav>
      )}

      <UserNav className={styles.userNav} />

    </div>
  );
}

export default GlobalHeader;
