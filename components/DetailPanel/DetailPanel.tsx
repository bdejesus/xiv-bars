import I18n from 'lib/I18n/locale/en-US';
import { formatDateString } from 'lib/utils/time';
import ExportToMacros from 'components/ExportToMacro';
import Sharing from 'components/Sharing';
import ReactMarkdown from 'react-markdown';
import SaveForm from 'components/SaveForm';
import EditLayoutButton from 'components/EditLayoutButton';
import Tags from 'components/Tags';
import { useAppState } from 'components/App/context';
import styles from './DetailPanel.module.scss';

export default function DetailPanel() {
  const {
    viewData, readOnly, selectedJob, viewAction
  } = useAppState();
  const {
    title,
    description,
    userId,
    user,
    updatedAt
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

      { (viewData && selectedJob && viewAction !== 'new') && (
        <div className={styles.meta}>
          <Tags layoutView={viewData} job={selectedJob} />
        </div>
      )}

      { (readOnly && title && userId)
        ? (
          <>
            <div className={styles.header}>
              <h3 className="mt-0 mb-0">{title}</h3>
              <div className={styles.owner}>by {user?.name}</div>
              { updatedAt && (
                <div className={styles.timestamp}>
                  {I18n.LayoutCard.last_updated}: {formatDateString(updatedAt as string)}
                </div>
              )}
            </div>

            <div className={styles.body}>
              { description && (
                <ReactMarkdown components={{
                  h1: 'h4', h2: 'h5', h3: 'h6', h4: 'p', h5: 'p', h6: 'p'
                }}
                >
                  {description}
                </ReactMarkdown>
              )}
            </div>
          </>
        )
        : <div className={styles.body}><SaveForm /></div> }
    </div>
  );
}
