import PropTypes from 'prop-types';
import { useState } from 'react';
import I18n from 'lib/I18n/locale/en-US';
import Card from 'components/Card';
import Job from 'components/JobSelect/Job';

import styles from './LayoutCard.module.scss';

function LayoutCard({
  layout, job, onDelete, className, hideName
}) {
  const [showPrompt, setShowPrompt] = useState(false);

  function formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  return (
    <div className={styles.layoutCard}>
      <a href={`/job/${layout.jobId}/${layout.id}`}>
        <Card className={[styles.card, className].join(' ')} href={`/job/${layout.jobId}/${layout.id}`}>
          <>
            { job && <Job job={job} className={styles.job} /> }
            <h4>{layout.title}</h4>
            <p className={styles.description}>{layout.description}</p>

            { !hideName && <div className={styles.owner}>{layout.user.name}</div> }

            <div className={styles.timestamp}>
              {I18n.LayoutCard.last_updated}: {formatDate(layout.updatedAt)}
            </div>
          </>
        </Card>
      </a>

      { onDelete && (
        <div className={styles.cardActions}>
          <button
            type="button"
            onClick={() => setShowPrompt(true)}
            className={styles.deleteButton}
            title={I18n.LayoutCard.delete_layout}
          >
            <div className={styles.deleteIcon}>&times;</div>
          </button>
        </div>
      )}

      { showPrompt && (
        <div className={styles.prompt} data-active={!showPrompt}>
          <div className={styles.promptContent}>
            <p>Are you sure you want to delete <b>{layout.title}</b>?</p>

            <div className={styles.promptActions}>
              <button type="button" onClick={onDelete}>
                {I18n.LayoutCard.delete}
              </button>
              <button type="button" onClick={() => setShowPrompt(false)}>
                {I18n.LayoutCard.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

LayoutCard.propTypes = {
  layout: PropTypes.shape().isRequired,
  job: PropTypes.shape().isRequired,
  onDelete: PropTypes.func,
  className: PropTypes.string,
  hideName: PropTypes.bool
};

LayoutCard.defaultProps = {
  onDelete: null,
  className: '',
  hideName: true
};

export default LayoutCard;
