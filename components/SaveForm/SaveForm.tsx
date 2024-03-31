import { createRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import I18n from 'lib/I18n/locale/en-US';
import { useAppDispatch, useAppState } from 'components/App/context';
import { useUserDispatch } from 'components/User/context';
import { UserActions } from 'components/User/actions';
import { AppActions } from 'components/App/actions';
import { SystemActions, useSystemDispatch } from 'components/System';
import ReactMarkdown from 'react-markdown';
import analytics from 'lib/analytics';
import type { LayoutViewProps } from 'types/Layout';
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
  const [validTitle, setValidTitle] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [shouldPublish, setShouldPublish] = useState(false);

  interface FilterOptions {
    filterKeys?: string[]
  }

  function saveLayout() {
    const prepareData = (
      data:LayoutViewProps,
      opts?:FilterOptions
    ) => Object.entries(data).reduce((collection, [key, value]) => {
      const noValue = (value === undefined && value === null);
      const shouldFilter = (noValue || opts?.filterKeys?.includes(key));
      if (!shouldFilter) {
        const formatVal = (key === 'hb') ? value?.toString() : value;
        return { ...collection, [key]: formatVal };
      }
      return collection;
    }, {});

    const body = {
      method: viewAction === 'new' ? 'create' : 'update',
      data: prepareData(
        {
          ...viewData,
          title: titleField.current?.value,
          description: descriptionField.current?.value
        },
        {
          filterKeys: ['user', 'createdAt', 'deletedAt', 'updatedAt', 'hearted', '_count', 'userId']
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

        if (viewAction === 'new') {
          analytics.event({ action: 'form_submit', params: { form_id: 'layout', form_name: 'new_layout' } });
          router.push(`/job/${layoutView.jobId}/${layoutView.id}`, undefined, { shallow: true });
        }
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
    const text = descriptionField.current?.value;
    const readyToPub = (text ? text.length > 0 : false);
    setShouldPublish(readyToPub);
  }

  function validateTitle() {
    setValidTitle(!!titleField?.current?.value);
  }

  useEffect(() => {
    const publishable = validTitle && !!viewData.encodedSlots && viewData.encodedSlots.length > 0;
    setCanPublish(publishable);
  }, [viewData, validTitle]);

  if (!session) return <SignInPrompt />;

  return (
    <div className={styles.saveForm}>
      <form className={styles.form}>
        <div className="control">
          <label htmlFor="title">
            <div>{I18n.SaveForm.title} <small>required</small></div>
            <input
              type="text"
              id="title"
              name="title"
              ref={titleField}
              className={styles.titleField}
              defaultValue={title}
              required
              onKeyUp={validateTitle}
            />
          </label>
        </div>

        <div className="control">
          <label htmlFor="description">
            <div>
              {I18n.SaveForm.description} <small><a href="https://www.markdownguide.org/basic-syntax/" target="_blank">{I18n.SaveForm.markdown_support}</a></small>
            </div>
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
            disabled={!canPublish}
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

        <ReactMarkdown className={styles.info}>
          {I18n.SaveForm.draft}
        </ReactMarkdown>
      </form>
    </div>
  );
}

export default SaveForm;
