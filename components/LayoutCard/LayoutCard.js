import PropTypes from 'prop-types';
import { useState } from 'react';
import I18n from 'lib/I18n/locale/en-US';
import Card from 'components/Card';
import Job from 'components/JobSelect/Job';

import styles from './LayoutCard.module.scss';

function LayoutCard({
  layout, job, onDelete, className
}) {
  const [showPrompt, setShowPrompt] = useState(false);

  function formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  return (
    <div className={styles.layoutCard}>
      <a href={`/job/${layout.jobId}/${layout.id}`}>
        <Card className={[styles.card, className].join(' ')}>
          <h4>{layout.title}</h4>
          <p className={styles.description}>{layout.description}</p>

          <div className={styles.cardFooter}>
            { job && <Job job={job} className={styles.job} /> }
            <div className={styles.timestamp}>
              {I18n.Pages.Me.last_updated}: {formatDate(layout.updatedAt)}
            </div>
          </div>
        </Card>
      </a>

      <div className={styles.cardActions}>
        <button
          type="button"
          onClick={() => setShowPrompt(true)}
          className={styles.deleteButton}
          title="Delete Layout"
        >
          <div className={styles.deleteIcon}>&times;</div>
        </button>
      </div>

      { showPrompt && (
        <div className={styles.prompt} data-active={!showPrompt}>
          <div className={styles.promptContent}>
            <p>Are you sure you want to delete <b>{layout.title}</b>?</p>
            <div className={styles.promptActions}>
              <button type="button" onClick={onDelete}>Delete</button>
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
              >
                Cancel
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
  onDelete: PropTypes.func.isRequired,
  className: PropTypes.string
};

LayoutCard.defaultProps = {
  className: ''
};

export default LayoutCard;
