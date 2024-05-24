import { createRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
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
  const { t } = useTranslation();
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
            text: t('SaveForm.success')
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
            text: t('SaveForm.failed')
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
    const publishable = viewAction === 'edit' || (validTitle
      && !!viewData.encodedSlots
      && viewData.encodedSlots.length > 0);
    setCanPublish(publishable);
  }, [viewData, validTitle]);

  if (!session) return <SignInPrompt />;

  return (
    <>
      <form className={styles.saveForm}>
        <div className={`control ${styles.titleField}`}>
          <label htmlFor="title">
            {t('SaveForm.title')} <small>{t('SaveForm.required')}</small>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            ref={titleField}
            className={styles.titleField}
            defaultValue={title}
            required
            onKeyUp={validateTitle}
          />
        </div>

        <div className={`control ${styles.descriptionField}`}>
          <label htmlFor="description">
            {t('SaveForm.description')} <small><a href="https://www.markdownguide.org/basic-syntax/" target="_blank">{t('SaveForm.markdown_support')}</a></small>
          </label>

          <textarea
            id="description"
            ref={descriptionField}
            className={styles.textarea}
            defaultValue={description}
            onChange={validateLayout}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={saveLayout}
            className={`button ${shouldPublish && 'btn-primary'}`}
            disabled={!canPublish}
          >
            { t('SaveForm.save') }
          </button>

          { viewAction !== 'new' && (
            <button
              onClick={cancelEdit}
              type="button"
              className={`${styles.cancelButton} button btn-clear`}
            >
              {t('SaveForm.cancel')}
            </button>
          )}
        </div>

      </form>

      <ReactMarkdown className={shouldPublish ? styles.info : styles.warning}>
        {t('SaveForm.draft')}
      </ReactMarkdown>
    </>
  );
}

export default SaveForm;
