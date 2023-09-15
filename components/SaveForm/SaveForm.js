import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppState } from 'components/App/context';
import { useUserDispatch } from 'components/User/context';
import I18n from 'lib/I18n/locale/en-US';

import styles from './SaveForm.module.scss';

function SaveForm() {
  const router = useRouter();
  const titleField = useRef();
  const descriptionField = useRef();
  const {
    layout,
    encodedSlots,
    viewData,
    selectedJob,
    xhb,
    wxhb,
    exhb,
    hb
  } = useAppState();
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();

  function saveLayout() {
    const title = titleField.current.value;
    const description = descriptionField.current.value;
    const jobId = viewData ? viewData.jobId : selectedJob.Abbr;

    const body = {
      id: viewData?.id,
      method: viewData ? 'update' : 'create',
      data: {
        title,
        description,
        layout,
        encodedSlots,
        jobId,
        xhb,
        wxhb,
        exhb,
        hb
      }
    };

    fetch('/api/layout', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((data) => data.json())
      .then((json) => {
        const [currentLayout, layouts] = json;
        appDispatch({
          type: 'saveLayout',
          viewData: { ...currentLayout, ...body }
        });
        userDispatch({ type: 'UPDATE_LAYOUTS', layouts: layouts.length });
        router.push(
          `/job/${currentLayout.jobId}/${currentLayout.id}`,
          undefined,
          { shallow: true }
        );
      })
      .catch((error) => {
        console.error(error);
        appDispatch({
          type: 'setMessage',
          message: {
            type: 'error',
            body: I18n.SaveForm.failed
          }
        });
      });
  }

  function closeForm() {
    router.reload();
    appDispatch({ type: 'cancelPublish' });
  }

  return (
    <div className={styles.saveForm}>
      <form className={`${styles.form} container`}>
        <div className="control">
          <label htmlFor="title">
            <div>{I18n.SaveForm.title}</div>
            <input
              type="text"
              id="title"
              name="title"
              ref={titleField}
              className={styles.titleField}
              defaultValue={viewData && viewData.title}
              required
            />
          </label>
        </div>

        <div className="control">
          <label htmlFor="description">
            <div>{I18n.SaveForm.description}</div>
            <textarea
              id="description"
              ref={descriptionField}
              className={styles.descriptionField}
              defaultValue={viewData && viewData.description}
            />
          </label>
        </div>

        <div className={`modal-footer ${styles.actions}`}>
          <button
            type="button"
            onClick={saveLayout}
            className={styles.submitButton}
          >
            {I18n.SaveForm.save_layout}
          </button>

          <button
            type="button"
            onClick={closeForm}
            className={styles.cancelButton}
          >
            {I18n.SaveForm.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SaveForm;
