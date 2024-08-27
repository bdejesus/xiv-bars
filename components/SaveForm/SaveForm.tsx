import React, { createRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppState } from 'components/App/context';
import { useUserDispatch } from 'components/User/context';
import { userActions } from 'components/User/actions';
import { appActions } from 'components/App/actions';
import { systemActions, useSystemDispatch } from 'components/System';
import analytics from 'lib/analytics';
import type { LayoutViewProps } from 'types/Layout';
import SignInPrompt from './SignInPrompt';

import styles from './SaveForm.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

function SaveForm() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const titleField = createRef<HTMLInputElement>();
  const descriptionField = createRef<HTMLTextAreaElement>();
  const publishedCheckbox = createRef<HTMLInputElement>();

  const { viewData, viewAction } = useAppState();
  const {
    title,
    description
  } = viewData;
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const systemDispatch = useSystemDispatch();
  const [validTitle, setValidTitle] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [viewDataStore, setViewDataStore] = useState<LayoutViewProps|undefined>(undefined);

  function saveLayout() {
    const prepareData = (
      data:LayoutViewProps,
      opts?:{ filterKeys?: string[] }
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
          description: descriptionField.current?.value,
          published: publishedCheckbox.current?.checked
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

        appDispatch({ type: appActions.UPDATE_VIEW, payload: layoutView });

        systemDispatch({
          type: systemActions.SET_MESSAGE,
          payload: {
            status: 'success',
            text: t('SaveForm.success')
          }
        });

        userDispatch({ type: userActions.UPDATE_LAYOUTS, payload: { layouts: layouts.length } });

        if (viewAction === 'new') {
          analytics.event({ action: 'form_submit', params: { form_id: 'layout', form_name: 'new_layout' } });
          router.push(`/job/${layoutView.jobId}/${layoutView.id}`, undefined, { shallow: true });
        }
      })
      .catch((error) => {
        console.error(error);
        systemDispatch({
          type: systemActions.SET_MESSAGE,
          payload: {
            status: 'fail',
            text: t('SaveForm.failed')
          }
        });
      });
  }

  function cancelEdit() {
    appDispatch({ type: appActions.CANCEL_EDITS, payload: { viewData: viewDataStore } });
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

  useEffect(() => {
    if (viewAction === 'edit') setViewDataStore(viewData);
  }, [viewAction]);

  function openMarkdownGuide(e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();

    appDispatch({
      type: appActions.SET_STATE,
      payload: {
        showMarkdownGuide: true
      }
    });
  }

  if (!session) return <SignInPrompt />;

  return (
    <form className={styles.saveForm}>
      <div className={`control ${styles.titleField}`}>
        <label htmlFor="layout-title">
          {t('SaveForm.title')} <small>{t('SaveForm.required')}</small>
        </label>

        <input
          id="layout-title"
          name="layout-title"
          type="text"
          ref={titleField}
          className={styles.titleField}
          defaultValue={title}
          required
          onKeyUp={validateTitle}
        />
      </div>

      <div className={`control ${styles.descriptionField}`}>
        <label htmlFor="layout-description">
          {t('SaveForm.description')}
          <small>
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              onClick={openMarkdownGuide}
            >
              {t('SaveForm.markdown_support')}
            </a>
          </small>
        </label>

        <textarea
          id="layout-description"
          name="layout-description"
          ref={descriptionField}
          className={styles.textarea}
          defaultValue={description}
        />
      </div>

      <div className={`control ${styles.options}`}>
        <label htmlFor="layout-publish">
          <input
            id="layout-publish"
            name="layout-publish"
            type="checkbox"
            defaultChecked={viewAction === 'new' || viewData.published}
            ref={publishedCheckbox}
          />
          <span className={styles.optionLabel}>
            { t('SaveForm.publish_layout') }
          </span>
          <span className={styles.optionInfo}>
            { t('SaveForm.publish_layout_info') }
          </span>
        </label>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={saveLayout}
          className="button btn-primary"
          disabled={!canPublish}
        >
          { t('SaveForm.save') }
        </button>

        { viewAction !== 'new' && (
        <button
          onClick={cancelEdit}
          type="button"
          className="button btn-clear"
        >
          {t('SaveForm.cancel')}
        </button>
        )}
      </div>

      <AdUnit
        id="ad-DetailPanel-SaveForm"
        variant="light"
        className="mt-lg"
        format="mediumRect"
      />
    </form>
  );
}

export default SaveForm;
