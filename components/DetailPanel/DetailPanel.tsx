import ExportToMacros from 'components/ExportToMacro';
import Sharing from 'components/Sharing';
import ReactMarkdown from 'react-markdown';
import SaveForm from 'components/SaveForm';
import EditLayoutButton from 'components/EditLayoutButton';
import { useAppState } from 'components/App/context';
import styles from './DetailPanel.module.scss';

export default function DetailPanel() {
  const {
    title,
    description,
    user,
    readOnly
  } = useAppState();

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

      { (readOnly && title && user)
        ? (
          <>
            <div className={styles.detailPanelHead}>
              <h3 className="mt-0 mb-0">{title}</h3>
              <div className={styles.owner}>by {user.name}</div>
            </div>

            <div className={styles.detailPanelBody}>
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
        : <div className={styles.detailPanelBody}><SaveForm /></div> }
    </div>
  );
}
