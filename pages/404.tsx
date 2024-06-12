'use client';

/* eslint-disable no-restricted-globals */
import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';

import type { GetStaticProps } from 'next';

import styles from './Index.module.scss';

export default function Error404() {
  const { t } = useTranslation();
  const pageTitle = `${t('Pages.NotFound.title')} • ${t('Pages.NotFound.status')} • XIVBARS`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.errorPage}>
        <AppContextProvider>
          <GlobalHeader />
        </AppContextProvider>

        <div className={styles.main}>
          <div className="container">
            <small>{t('Pages.NotFound.status')}</small>
            <h1>{t('Pages.NotFound.title')}</h1>
            <p>{t('Pages.NotFound.body')}</p>

            <ul>
              <li>
                <a href="/" onClick={() => history.back()}>
                  {t('Pages.NotFound.option1')}
                </a>
              </li>

              <li>
                <a href="https://github.com/bdejesus/xiv-bars/issues">
                  {t('Pages.NotFound.option2')}
                </a>
              </li>

              <li>
                <a href="/">
                  {t('Pages.NotFound.option3')}
                </a>
              </li>
            </ul>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps:GetStaticProps = async (context) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, ['common'])),
  }
});
