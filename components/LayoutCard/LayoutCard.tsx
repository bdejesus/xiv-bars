import React, { useState } from 'react';
import { formatDateString } from 'lib/utils/time';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useUserDispatch, userActions } from 'components/User';
import Icon, { Icons } from 'components/Icon';
import Tags from 'components/Tags';
import Hearts from 'components/Hearts';
import ProfileImage from 'components/User/ProfileImage';

import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutViewProps } from 'types/Layout';
import Summary from './Summary';

import styles from './LayoutCard.module.scss';

interface LayoutCardProps {
  layout: LayoutViewProps,
  job: ClassJobProps,
  className?: string,
  hideName: boolean
}

export default function LayoutCard({
  layout,
  job,
  className = undefined,
  hideName
}:LayoutCardProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const userDispatch = useUserDispatch();

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
        userDispatch({ type: userActions.UPDATE_LAYOUTS, payload: { layouts: json } });
        setShowPrompt(false);
      });
  }

  if (!layout.user) return null;

  const updatedAt = formatDateString(layout.updatedAt as string, router.locale!);

  return (
    <div className={[styles.layoutCard, className].join(' ')}>
      <Tags layoutView={layout} job={job} className={styles.tags}>
        { layout._count?.hearts > 0 && (
          <Hearts
            layoutId={layout.id as number}
            count={layout._count?.hearts || 0}
            className={styles.hearts}
            isHearted
          />
        )}
        { isOwner && !layout.published && (
          <div className={`tag ${styles.publishTag}`}>
            { t('LayoutCard.draft') }
          </div>
        )}
      </Tags>

      <Summary
        id={layout.id!}
        title={layout.title!}
        description={layout.description}
        job={job}
      />

      <div className={styles.footer}>
        <ProfileImage
          src={layout.user.image}
          title={layout.user.name}
          href={`/user/${layout.userId}`}
          className={styles.profileImage}
        />

        { !hideName && (
          <div
            className={styles.owner}
            itemScope
            itemType="https://schema.org/Person"
            itemProp="author"
          >
            <a href={`/user/${layout.userId}`} itemProp="url">
              <span itemProp="name">{layout.user.name}</span>
            </a>
          </div>
        )}

        { layout.updatedAt && (
          <div className={styles.timestamp}>
            {t('LayoutCard.last_updated')}: <time dateTime={layout.updatedAt}>{updatedAt}</time>
          </div>
        )}
      </div>

      <div
        className={styles.jobBackdrop}
        style={{ backgroundImage: `url(/jobIcons/${job.Name.replaceAll(' ', '')}.png` }}
      />

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
