import React, { useState, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import Icon, { Icons } from 'components/Icon';
import JobMenu from 'components/JobSelect/JobMenu';
import Modal from 'components/Modal';
import styles from './JobSelect.module.scss';

interface Props {
  disabled?: boolean,
  className?: string,
  children?: ReactNode,
  action?: 'new'
}

export function JobSelect({
  disabled, className, children, action
}: Props) {
  const { t } = useTranslation();
  const [showJobsModal, setShowJobsModal] = useState(false);

  const classNames = () => {
    const selectors = [styles.jobSelectModal];
    if (action) selectors.push(styles[action]);
    return selectors.join(' ');
  };

  function handleShowJobs() {
    setShowJobsModal(true);
  }

  return (
    <>
      <button
        type="button"
        id="jobSelectTitle"
        className={[styles.button, className].join(' ')}
        onClick={handleShowJobs}
        disabled={disabled}
        data-title={children ? null : t('JobSelect.job_select')}
      >
        { children || (
          <>
            <Icon id={Icons.OPTIONS} alt="Options" />
            <span className="btn-label-hidden">{t('JobSelect.job_select')}</span>
          </>
        )}
      </button>

      <Modal
        showModal={showJobsModal}
        onClose={() => setShowJobsModal(false)}
        className={classNames()}
      >
        <JobMenu action={action} />
      </Modal>
    </>
  );
}

JobSelect.defaultProps = {
  disabled: undefined,
  className: '',
  children: undefined,
  action: undefined
};

export default JobSelect;
