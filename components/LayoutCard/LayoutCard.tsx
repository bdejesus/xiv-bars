import React, { useState } from 'react';
import Link from 'next/link';
import I18n from 'lib/I18n/locale/en-US';
import Card from 'components/Card';
import Job from 'components/JobSelect/Job';
import Icon from 'components/Icon';
import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutProps } from 'types/Layout';
import styles from './LayoutCard.module.scss';

interface Props {
  layout: LayoutProps,
  job: ClassJobProps,
  onDelete?: React.MouseEventHandler,
  className?: string,
  hideName: boolean
}

export default function LayoutCard({
  layout, job, onDelete, className, hideName
}: Props) {
  const [showPrompt, setShowPrompt] = useState(false);

  function formatDate(date: string) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  return (
    <div className={styles.layoutCard}>
      <Link href={`/job/${layout.jobId}/${layout.id}`}>
        <Card className={[styles.card, className].join(' ')}>
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
      </Link>

      { !!onDelete && (
        <div className={styles.cardActions}>
          <button
            type="button"
            onClick={() => setShowPrompt(true)}
            className={styles.deleteButton}
            title={I18n.LayoutCard.delete_layout}
          >
            <Icon id="remove" className={styles.deleteIcon} title={I18n.LayoutCard.delete_layout} />
            <span className="btn-label-hidden">{I18n.LayoutCard.delete_layout}</span>
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

LayoutCard.defaultProps = {
  onDelete: undefined,
  className: ''
};
