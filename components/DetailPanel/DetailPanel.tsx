import Link from 'next/link';
import I18n from 'lib/I18n/locale/en-US';
import { formatDateString } from 'lib/utils/time';
import ExportToMacros from 'components/ExportToMacro';
import Sharing from 'components/Sharing';
import ReactMarkdown from 'react-markdown';
import SaveForm from 'components/SaveForm';
import EditLayoutButton from 'components/EditLayoutButton';
import Tags from 'components/Tags';
import Hearts from 'components/Hearts';
import { useAppState } from 'components/App/context';
import { useSession } from 'next-auth/react';
import styles from './DetailPanel.module.scss';

export default function DetailPanel() {
  const { data: session } = useSession();
  const {
    viewData, readOnly, selectedJob
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
    <div className={styles.container}>
      <div className={styles.actions}>
        <div className={styles.actionGroup}>
          <Sharing />
          <ExportToMacros />
        </div>
        <div className={styles.actionGroup}>
          <EditLayoutButton />
        </div>
      </div>

      { (readOnly && title && userId)
        ? (
          <>
            <div className={styles.header}>
              <h1 className="mt-0 mb-0">{title}</h1>

              <div className={styles.meta}>
                <div className={styles.owner}>
                  {I18n.LayoutCard.by} <Link href={`/user/${userId}`}>{user?.name}</Link>
                </div>

                { updatedAt && (
                  <div className={styles.timestamp}>
                    {I18n.LayoutCard.last_updated}: {formatDateString(updatedAt as string)}
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
                  h1: 'h4', h2: 'h5', h3: 'h6', h4: 'p', h5: 'p', h6: 'p'
                }}
                >
                  {description}
                </ReactMarkdown>
              ) : (
                <ReactMarkdown className="inline-message warn">
                  {I18n.DetailPanel.draft}
                </ReactMarkdown>
              )}
            </div>
          </>
        )
        : <div className={styles.body}><SaveForm /></div> }
    </div>
  );
}
