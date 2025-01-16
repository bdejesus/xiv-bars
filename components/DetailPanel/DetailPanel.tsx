import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatDateString } from 'lib/utils/time';
import ReactMarkdown from 'react-markdown';
import SaveForm from 'components/SaveForm';
import EditLayoutButton from 'components/EditLayoutButton';
import Tags from 'components/Tags';
import Hearts from 'components/Hearts';
import JobSprite, { hasSprite } from 'components/JobSprite';
import LayoutCard from 'components/LayoutCard';
import { useAppState } from 'components/App/context';
import { useSession } from 'next-auth/react';
import ProfileImage from 'components/User/ProfileImage';
import dynamic from 'next/dynamic';
import ToggleDetailPanel from './ToggleDetailPanel';
import styles from './DetailPanel.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

interface Props {
  className?: string,
  visible: boolean
}

export default function DetailPanel({ className = '', visible }:Props) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const {
    selectedJob, viewAction, viewData
  } = useAppState();
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
  const showSprite = selectedJob && hasSprite(selectedJob);

  return (
    <div
      className={[styles.container, className].join(' ')}
      data-hidden={!visible}
      data-action={viewAction}
    >
      <ToggleDetailPanel />
      <div className={`${styles.content} markdown`}>
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
                  <div className={styles.row}>
                    <ProfileImage
                      src={user!.image}
                      title={user!.name}
                      className={styles.profileImage}
                      href={`/user/${userId}`}
                    />
                    <div>
                      <div
                        className={styles.owner}
                        itemScope
                        itemProp="author"
                        itemType="https://schema.org/Person"
                      >
                        <Link href={`/user/${userId}`} itemProp="url">
                          <span itemProp="name">{user?.name}</span>
                        </Link>
                      </div>

                      { updatedAt && (
                        <div className={styles.timestamp}>
                          {t('LayoutCard.last_updated')}:&nbsp;
                          <time dateTime={updatedAt} itemProp="modifiedAt">
                            {formatDateString(updatedAt as string, router.locale)}
                          </time>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.row}>
                    { id && (
                    <Hearts
                      layoutId={id}
                      count={_count?.hearts}
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
                          {published ? t('LayoutCard.published') : t('LayoutCard.draft')}
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

                <AdUnit
                  format="mediumRect"
                  id="ad-DetailPanel"
                  variant="light"
                  className="mt-xl"
                />
              </div>
            </>
          )
          : (
            <div className={styles.body}>
              <SaveForm />
            </div>
          )}

        <div className={styles.footer}>
          { (viewData.parentLayout && selectedJob) && (
            <div className="mb-lg">
              <h3 className="mb-md">
                {t('DetailPanel.reference_layout')}
              </h3>
              <LayoutCard layout={viewData.parentLayout} job={selectedJob} theme="light" />
            </div>
          )}

          { showSprite && (
            <JobSprite job={selectedJob} className={styles.jobSprite} />
          )}
        </div>
      </div>
    </div>
  );
}
