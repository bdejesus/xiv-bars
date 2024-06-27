import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatDateString } from 'lib/utils/time';
import ReactMarkdown from 'react-markdown';
import SaveForm from 'components/SaveForm';
import EditLayoutButton from 'components/EditLayoutButton';
import Tags from 'components/Tags';
import Hearts from 'components/Hearts';
import JobSprite from 'components/JobSprite';
import { useAppState } from 'components/App/context';
import { useSession } from 'next-auth/react';
import ToggleDetailPanel from './ToggleDetailPanel';
import styles from './DetailPanel.module.scss';

interface Props {
  className?: string,
  visible: boolean
}

export default function DetailPanel({ className, visible }:Props) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const { selectedJob, viewAction, viewData } = useAppState();
  const {
    title,
    description,
    userId,
    user,
    updatedAt,
    _count,
    id,
    hearted,
    published
  } = viewData;

  const isOwner = session?.user.id === userId;
  const hasSprite = selectedJob && (
    selectedJob.Abbreviation
    || ['DOW', 'DOM'].includes(selectedJob.Discipline)
    || !['BLU', 'VPR'].includes(selectedJob.Abbreviation)
  );

  return (
    <div
      className={[styles.container, className].join(' ')}
      data-hidden={!visible}
      data-action={viewAction}
    >
      <ToggleDetailPanel />

      <div className={styles.content}>
        { title && viewAction === 'show'
          ? (
            <>
              <div className={styles.header}>
                <div className={styles.title}>
                  <h1 className="mt-0 mb-0" itemProp="name">
                    {title}
                  </h1>
                  <EditLayoutButton />
                </div>

                <div className={styles.meta}>
                  <div
                    className={styles.owner}
                    itemScope
                    itemProp="author"
                    itemType="https://schema.org/Person"
                  >
                    {t('LayoutCard.by')}&nbsp;
                    <Link href={`/user/${userId}`} itemProp="url">
                      <span itemProp="name">{user?.name}</span>
                    </Link>
                  </div>

                  { updatedAt && (
                    <div className={styles.timestamp}>
                      {t('LayoutCard.last_updated')}: <time dateTime={updatedAt}>{formatDateString(updatedAt as string, router.locale)}</time>
                    </div>
                  )}

                  <div className={styles.row}>
                    { id && (
                    <Hearts
                      layoutId={id}
                      count={_count.hearts}
                      disabled={!session}
                      hearted={hearted}
                    />
                    )}

                    { (viewData && selectedJob) && (
                      <Tags layoutView={viewData} job={selectedJob} />
                    )}

                    { isOwner && (
                      <div
                        className={`tag ${styles.publishedTag}`}
                        data-published={published}
                      >
                        <span className="tag-name">
                          { published ? t('LayoutCard.published') : t('LayoutCard.draft') }
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              <div className={styles.body} itemProp="text">
                { description ? (
                  <ReactMarkdown components={{
                    h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6', h6: 'p'
                  }}
                  >
                    {description}
                  </ReactMarkdown>
                ) : (
                  <ReactMarkdown className="inline-message warn">
                    {t('DetailPanel.draft')}
                  </ReactMarkdown>
                )}
              </div>
            </>
          )
          : (
            <div className={styles.body}>
              <SaveForm />
            </div>
          )}

        { selectedJob && ['PCT', 'VPR'].includes(selectedJob.Abbr) && (
          <p className="system-message warn">
            The <b>Viper (VPR)</b> and <b>Pictomancer (PCT)</b> Class/Jobs are now available in a preview/development state. Layouts created prior to the release of patch 7.0 may break as Actions and other features associated with those Jobs are subject to change.
          </p>
        )}

        { hasSprite && <div className={styles.footer}><JobSprite job={selectedJob} /></div> }
      </div>
    </div>
  );
}

DetailPanel.defaultProps = {
  className: undefined
};
