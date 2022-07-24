import { useRef } from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import { useAppState } from 'components/App/context';

import styles from './SaveLayout.module.scss';

function SaveForm({ onSubmit }) {
  const titleField = useRef();
  const descriptionField = useRef();
  const {
    layout,
    encodedSlots,
    viewData,
    selectedJob
  } = useAppState();

  function saveLayout() {
    const title = titleField.current.value;
    const description = descriptionField.current.value;
    const jobId = viewData ? viewData.jobId : selectedJob.Abbr;

    const body = {
      id: viewData ? viewData.id : null,
      data: {
        title,
        description,
        layout,
        encodedSlots,
        jobId
      }
    };

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    };

    fetch('/api/layout/save', fetchOptions).then(() => onSubmit());
  }

  return (
    <form className={styles.form}>
      <div className="control">
        <label htmlFor="title">
          <div>Title</div>
          <input
            type="text"
            id="title"
            name="title"
            ref={titleField}
            className={styles.titleField}
            defaultValue={viewData && viewData.title}
          />
        </label>
      </div>

      <div className="control">
        <label htmlFor="description">
          <div>Description</div>
          <textarea
            id="description"
            ref={descriptionField}
            className={styles.descriptionField}
            defaultValue={viewData && viewData.description}
          />
        </label>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          onClick={saveLayout}
          className={styles.submitButton}
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default SaveForm;

SaveForm.propTypes = {
  onSubmit: PropTypes.func
};

SaveForm.defaultProps = {
  onSubmit: () => {
    // noop
  }
};
