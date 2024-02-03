import React, { useState } from 'react';
import Link from 'next/link';
import I18n from 'lib/I18n/locale/en-US';
import { formatDateString } from 'lib/utils/time';
import Card from 'components/Card';
import Icon, { Icons } from 'components/Icon';
import Tags from 'components/Tags';
import { useUserDispatch, UserActions } from 'components/User';
import type { ClassJobProps } from 'types/ClassJob';
import type { ViewDataProps } from 'types/View';
import styles from './LayoutCard.module.scss';

interface Props {
  layout: ViewDataProps,
  job: ClassJobProps,
  // eslint-disable-next-line no-unused-vars
  afterDelete?: (updatedList:ViewDataProps[]) => void,
  className?: string,
  hideName: boolean
}

export default function LayoutCard(props:Props) {
  const userDispatch = useUserDispatch();
  const {
    layout, job, afterDelete, className, hideName
  } = props;
  const [showPrompt, setShowPrompt] = useState(false);

  function destroyLayout() {
    const options = {
      method: 'POST',
      body: JSON.stringify({ id: layout.id, method: 'destroy' }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/layout', options)
      .then((data) => data.json())
      .then((json) => {
        if (afterDelete) afterDelete(json);
        userDispatch({ type: UserActions.UPDATE_LAYOUTS, payload: { layouts: json.length } });
      });
  }

  if (!layout.user) return null;

  return (
    <div className={styles.layoutCard}>
      <Link href={`/job/${layout.jobId}/${layout.id}`}>
        <Card className={[styles.card, className].join(' ')}>
          <>
            <Tags layoutView={layout} job={job} />
            <h4>{layout.title}</h4>
            { !hideName && <div className={styles.owner}>{layout.user.name}</div> }

            { layout.updatedAt && (
              <div className={styles.timestamp}>
                {I18n.LayoutCard.last_updated}: {formatDateString(layout.updatedAt as string)}
              </div>
            )}
          </>
        </Card>
      </Link>

      { !!afterDelete && (
        <div className={styles.cardActions}>
          <button
            type="button"
            onClick={() => setShowPrompt(true)}
            className={styles.deleteButton}
            title={I18n.LayoutCard.delete_layout}
          >
            <Icon id={Icons.REMOVE} className={styles.deleteIcon} alt={I18n.LayoutCard.delete_layout} />
            <span className="btn-label-hidden">{I18n.LayoutCard.delete_layout}</span>
          </button>
        </div>
      )}

      { showPrompt && (
        <div className={styles.prompt} data-active={!showPrompt}>
          <div className={styles.promptContent}>
            <p>Are you sure you want to delete <b>{layout.title}</b>?</p>

            <div className={styles.promptActions}>
              <button type="button" onClick={destroyLayout}>
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
  afterDelete: undefined,
  className: ''
};
