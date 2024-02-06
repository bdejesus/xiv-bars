import { createRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import I18n from 'lib/I18n/locale/en-US';

import { useAppDispatch, useAppState } from 'components/App/context';
import { useUserDispatch } from 'components/User/context';
import { UserActions } from 'components/User/actions';
import { AppActions } from 'components/App/actions';
import { SystemActions, useSystemDispatch } from 'components/System';
import { filterUndefined } from 'lib/utils/filters';
import SignInPrompt from './SignInPrompt';

import styles from './SaveForm.module.scss';

function SaveForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const titleField = createRef<HTMLInputElement>();
  const descriptionField = createRef<HTMLTextAreaElement>();

  const { viewData, viewAction } = useAppState();
  const {
    title,
    description,
  } = viewData;
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const systemDispatch = useSystemDispatch();
  const [canPublish, setCanPublish] = useState(false);
  const [shouldPublish, setShouldPublish] = useState(false);

  function saveLayout() {
    const body = {
      method: viewAction === 'new' ? 'create' : 'update',
      data: filterUndefined(
        {
          ...viewData,
          title: titleField.current?.value,
          description: descriptionField.current?.value
        },
        {
          filterKeys: ['user', 'createdAt', 'deletedAt', 'updatedAt']
        }
      )
    };

    fetch('/api/layout', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((data) => data.json())
      .then((json) => {
        const { layoutView, layouts } = json;

        appDispatch({ type: AppActions.UPDATE_VIEW, payload: layoutView });

        systemDispatch({
          type: SystemActions.SET_MESSAGE,
          payload: {
            status: 'success',
            text: I18n.SaveForm.success
          }
        });

        userDispatch({ type: UserActions.UPDATE_LAYOUTS, payload: { layouts: layouts.length } });

        router.push(`/job/${layoutView.jobId}/${layoutView.id}`, undefined, { shallow: true });
      })
      .catch((error) => {
        console.error(error);
        systemDispatch({
          type: SystemActions.SET_MESSAGE,
          payload: {
            status: 'fail',
            text: I18n.SaveForm.failed
          }
        });
      });
  }

  function cancelEdit() {
    appDispatch({ type: AppActions.CANCEL_EDITS });
  }

  function validateLayout() {
    const value = descriptionField.current?.value;
    const readyToPub = (value ? value.length > 0 : false);
    setShouldPublish(readyToPub);
  }

  useEffect(() => {
    const publishable = !!viewData.encodedSlots && viewData.encodedSlots.length > 0;
    setCanPublish(publishable);
  }, [router.query]);

  if (!session) return <SignInPrompt />;

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
              onChange={validateLayout}
            />
          </label>
        </div>

        <div className={`modal-footer ${styles.actions}`}>
          <button
            type="button"
            onClick={saveLayout}
            className={`button ${shouldPublish && 'btn-primary'}`}
            disabled={!canPublish || undefined}
          >
            { shouldPublish ? I18n.SaveForm.publish_layout : I18n.SaveForm.save_draft }
          </button>

          { viewAction !== 'new' && (
            <button
              onClick={cancelEdit}
              type="button"
              className={`${styles.cancelButton} button btn-clear`}
            >
              {I18n.SaveForm.cancel}
            </button>
          )}
        </div>

        <p className={styles.info}>
          <b>Layouts</b> with no descriptions are treated as drafts and are hidden from public listings. They are still accessible via the <b>Layout</b> url.
        </p>
      </form>
    </div>
  );
}

export default SaveForm;
