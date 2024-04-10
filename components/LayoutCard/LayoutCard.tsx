import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDateString } from 'lib/utils/time';
import Card from 'components/Card';
import Icon, { Icons } from 'components/Icon';
import Tags from 'components/Tags';
import Hearts from 'components/Hearts';
import { useUserDispatch, UserActions } from 'components/User';
import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutViewProps } from 'types/Layout';
import styles from './LayoutCard.module.scss';

interface Props {
  layout: LayoutViewProps,
  job: ClassJobProps,
  // eslint-disable-next-line no-unused-vars
  className?: string,
  hideName: boolean
}

export default function LayoutCard(props:Props) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const userDispatch = useUserDispatch();
  const {
    layout, job, className, hideName
  } = props;
  const [showPrompt, setShowPrompt] = useState(false);
  const isOwner = session?.user.id === layout.userId;

  function destroyLayout() {
    const options = {
      method: 'POST',
      body: JSON.stringify({ id: layout.id, method: 'destroy' }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/layout', options)
      .then((data) => data.json())
      .then((json) => {
        userDispatch({ type: UserActions.UPDATE_LAYOUTS, payload: { layouts: json } });
        setShowPrompt(false);
      });
  }

  if (!layout.user) return null;

  return (
    <div className={styles.layoutCard}>
      <Card className={[styles.card, className].join(' ')}>
        <Link href={`/job/${layout.jobId}/${layout.id}`} className={styles.main}>
          <h3>{layout.title}</h3>

          <p className={styles.description}>
            {layout.description && layout.description}
          </p>
        </Link>

        { !hideName && (
          <div className={styles.owner}>
            <Link href={`/user/${layout.userId}`}>
              {layout.user.name}
            </Link>
          </div>
        )}

        { layout.updatedAt && (
          <div className={styles.timestamp}>
            {t('LayoutCard.last_updated')}: {formatDateString(layout.updatedAt as string)}
          </div>
        )}

        <div className={styles.footer}>
          { layout._count?.hearts > 0 && (
            <Hearts
              layoutId={layout.id as number}
              count={layout._count?.hearts || 0}
              className={styles.hearts}
            />
          )}
          <Tags layoutView={layout} job={job} />
        </div>

        <div
          className={styles.jobBackdrop}
          style={{ backgroundImage: `url('/jobIcons${job.Icon}')` }}
        />
      </Card>

      { !!isOwner && (
        <div className={styles.cardActions}>
          <button
            type="button"
            onClick={() => setShowPrompt(true)}
            className={styles.deleteButton}
            title={t('LayoutCard.delete_layout')}
          >
            <Icon id={Icons.REMOVE} className={styles.deleteIcon} alt={t('LayoutCard.delete_layout')} />
            <span className="btn-label-hidden">{t('LayoutCard.delete_layout')}</span>
          </button>
        </div>
      )}

      { showPrompt && (
        <div className={styles.prompt} data-active={!showPrompt}>
          <div className={styles.promptContent}>
            <p>{t('LayoutCard.delete_confirm')}<br /><b>{layout.title}</b></p>

            <div className={styles.promptActions}>
              <button type="button" onClick={destroyLayout} className="btn-danger">
                {t('LayoutCard.delete')}
              </button>
              <button type="button" onClick={() => setShowPrompt(false)}>
                {t('LayoutCard.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

LayoutCard.defaultProps = {
  className: ''
};
