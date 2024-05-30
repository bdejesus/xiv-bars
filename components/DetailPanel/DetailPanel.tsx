import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { formatDateString } from 'lib/utils/time';
import ReactMarkdown from 'react-markdown';
import SaveForm from 'components/SaveForm';
import EditLayoutButton from 'components/EditLayoutButton';
import Tags from 'components/Tags';
import Hearts from 'components/Hearts';
import { useAppState } from 'components/App/context';
import { useSession } from 'next-auth/react';
import type { ClassJobProps } from 'types/ClassJob';
import ToggleDetailPanel from './ToggleDetailPanel';
import styles from './DetailPanel.module.scss';

interface JobSpriteProps {
  job: ClassJobProps
}

function JobSprite({ job }:JobSpriteProps) {
  if (
    !job?.Abbreviation
    || !['DOW', 'DOM'].includes(job?.Discipline)
    || job?.Abbreviation === 'BLU'
  ) return null;

  return (
    <div className={styles.footer}>
      <Image src={`/classjob/sprite-${job.Abbreviation}.png`} alt={job.Name} height={52} width={52} />
    </div>
  );
}

interface Props {
  className?: string,
  visible: boolean
}

export default function DetailPanel({ className, visible }:Props) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const {
    viewData, readOnly, selectedJob, viewAction
  } = useAppState();

  const {
    title,
    description,
    userId,
    user,
    updatedAt,
    _count,
    id,
    hearted
  } = viewData;

  return (
    <div
      className={[styles.container, className].join(' ')}
      data-hidden={!visible}
      data-action={viewAction}
    >
      <ToggleDetailPanel />

      <div className={styles.content}>
        { (readOnly && title && userId)
          ? (
            <>
              <div className={styles.header}>
                <div className={styles.title}>
                  <h1 className="mt-0 mb-0">
                    {title}
                  </h1>
                  <EditLayoutButton />
                </div>

                <div className={styles.meta}>
                  <div className={styles.owner}>
                    {t('LayoutCard.by')} <Link href={`/user/${userId}`}>{user?.name}</Link>
                  </div>

                  { updatedAt && (
                  <div className={styles.timestamp}>
                    {t('LayoutCard.last_updated')}: {formatDateString(updatedAt as string)}
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
                  </div>
                </div>
              </div>

              <div className={styles.body}>
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

              { selectedJob && <JobSprite job={selectedJob} /> }
            </>
          )
          : (
            <div className={styles.body}>
              <SaveForm />
              { selectedJob && <JobSprite job={selectedJob} /> }
            </div>
          )}
      </div>
    </div>
  );
}

DetailPanel.defaultProps = {
  className: undefined
};
