import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Icon, { Icons } from 'components/Icon';
import JobMenu from 'components/JobSelect/JobMenu';
import Modal from 'components/Modal';
import styles from './JobSelect.module.scss';

interface Props {
  disabled?: boolean,
  className?: string
}

export function JobSelect({ disabled, className }: Props) {
  const { t } = useTranslation();
  const [showJobsModal, setShowJobsModal] = useState(false);

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
        data-title={t('JobSelect.job_select')}
      >
        <Icon id={Icons.OPTIONS} alt="Options" />
        <span className="btn-label-hidden">{t('JobSelect.job_select')}</span>
      </button>

      <Modal showModal={showJobsModal} onClose={() => setShowJobsModal(false)}>
        <JobMenu />
      </Modal>
    </>
  );
}

JobSelect.defaultProps = {
  disabled: null,
  className: ''
};

export default JobSelect;
