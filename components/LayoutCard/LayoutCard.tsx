import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDateString } from 'lib/utils/time';
import Card from 'components/Card';
import Icon, { Icons } from 'components/Icon';
import Tags from 'components/Tags';
import Hearts from 'components/Hearts';
import ReactMarkdown from 'react-markdown';
import { useUserDispatch, userActions } from 'components/User';
import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutViewProps } from 'types/Layout';
import styles from './LayoutCard.module.scss';

interface Props {
  layout: LayoutViewProps,
  job: ClassJobProps,
  className?: string,
  hideName: boolean
}

export default function LayoutCard(props:Props) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
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
        userDispatch({ type: userActions.UPDATE_LAYOUTS, payload: { layouts: json } });
        setShowPrompt(false);
      });
  }

  if (!layout.user) return null;

  const updatedAt = formatDateString(layout.updatedAt as string, router.locale!);

  return (
    <div className={styles.layoutCard}>
      <Card className={[styles.card, className].join(' ')}>
        <div className={styles.tags}>
          <Tags layoutView={layout} job={job} />
          { layout._count?.hearts > 0 && (
            <Hearts
              layoutId={layout.id as number}
              count={layout._count?.hearts || 0}
              className={styles.hearts}
            />
          )}
        </div>

        <a
          href={`/job/${layout.jobId}/${layout.id}`}
          className={styles.main}
          itemProp="url"
        >
          <h3 title={layout.title} itemProp="name">{layout.title}</h3>

          <div className={styles.subtitle} itemProp="description" aria-hidden="true">
            { t('Pages.Job.short_description', { jobName: job.Name }) }
          </div>

          <div className={styles.description} itemProp="text">
            { layout.description && (
              <ReactMarkdown components={{
                h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6', h6: 'p'
              }}
              >
                {layout.description.substring(0, 255)}
              </ReactMarkdown>
            )}
          </div>
        </a>

        <div className={styles.footer}>
          { !hideName && (
            <div
              className={styles.owner}
              itemScope
              itemType="https://schema.org/Person"
              itemProp="author"
            >
              <Link href={`/user/${layout.userId}`} itemProp="url">
                <span itemProp="name">{layout.user.name}</span>
              </Link>
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
