import { createRef } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppState } from 'components/App/context';
import { useUserDispatch } from 'components/User/context';
import { UserActions } from 'components/User/actions';
import { AppAction } from 'components/App/actions';
import I18n from 'lib/I18n/locale/en-US';
import styles from './SaveForm.module.scss';

function SaveForm() {
  const router = useRouter();
  const titleField = createRef<HTMLInputElement>();
  const descriptionField = createRef<HTMLTextAreaElement>();
  const {
    layout,
    encodedSlots,
    selectedJob,
    xhb,
    wxhb,
    exhb,
    hb,
    layoutId,
    title,
    description,
    jobId
  } = useAppState();
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();

  function saveLayout() {
    const body = JSON.stringify({
      layoutId,
      method: layoutId ? 'update' : 'create',
      data: {
        title: titleField.current?.value,
        description: descriptionField.current?.value,
        layout,
        encodedSlots,
        jobId: jobId || selectedJob?.Abbr,
        xhb,
        wxhb,
        exhb,
        hb
      }
    });

    fetch('/api/layout', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
      .then((data) => data.json())
      .then((json) => {
        const { layoutView, layouts } = json;

        appDispatch({
          type: AppAction.LAYOUT_SAVED,
          payload: {
            ...layoutView,
            message: {
              type: 'success',
              body: I18n.SaveForm.success
            }
          }
        });

        userDispatch({ type: UserActions.UPDATE_LAYOUTS, payload: { layouts: layouts.length } });

        router.push(
          `/job/${layoutView.jobId}/${layoutView.id}`,
          undefined,
          { shallow: true }
        );
      })
      .catch((error) => {
        console.error(error);
        appDispatch({
          type: AppAction.UPDATE_MESSAGE,
          payload: {
            message: {
              type: 'error',
              body: I18n.SaveForm.failed
            }
          }
        });
      });
  }

  function cancelEdit() {
    appDispatch({ type: AppAction.CANCEL_EDITS });
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
              defaultValue={title}
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
              defaultValue={description}
            />
          </label>
        </div>

        <div className={`modal-footer ${styles.actions}`}>
          <button
            type="button"
            onClick={saveLayout}
            className={`${styles.submitButton} button btn-primary`}
          >
            {I18n.SaveForm.save_layout}
          </button>

          { layoutId && (
            <button
              onClick={cancelEdit}
              type="button"
              className={`${styles.cancelButton} button btn-clear`}
            >
              {I18n.SaveForm.cancel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default SaveForm;
