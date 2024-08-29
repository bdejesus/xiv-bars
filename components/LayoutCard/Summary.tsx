import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { ClassJobProps } from 'types/ClassJob';

import styles from './Summary.module.scss';

interface SummaryProps {
  id: number,
  title: string,
  description?: string,
  job: ClassJobProps,
  layout: number,
  theme?: 'light' | 'dark'
}

export default function Summary({
  id,
  title,
  description = undefined,
  job,
  layout,
  theme = 'dark'
}:SummaryProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const layoutUrl = `/job/${job.Abbr}/${id}`;
  const shortDesc = description && description
    .split('\n\n')
    .filter((p) => p.trim() !== '')
    .slice(0, 2)
    .join('\n\n');
  const excerpt = description && description
    .replaceAll('- ', '')
    .split('\n')
    .filter((p) => p.trim() !== '')[0]
    .replace(/[.,:;\s]+$/, '');
  const hotbarLayout = layout === 0 ? t('Hotbars.xhb') : t('Hotbars.hb');

  function handleClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
    router.push(layoutUrl);
    e.preventDefault();
  }

  function handleKeyPress(e:React.KeyboardEvent<HTMLElement>) {
    if (e.code === 'Enter') router.push(layoutUrl);
  }

  return (
    <div
      className={[styles.summary, styles[theme]].join(' ')}
      role="button"
      onClick={handleClick}
      onKeyUp={handleKeyPress}
      tabIndex={0}
    >
      <a href={layoutUrl} itemProp="url" className={styles.titleLink}>
        <h3 title={title} itemProp="name">{title}</h3>
      </a>

      <meta
        itemProp="description"
        content={`${excerpt}. ${t('Pages.Job.short_description', { jobName: job.Name, hotbarLayout })}`}
      />

      <div className={styles.description} itemProp="text">
        { description && (
          <ReactMarkdown components={{
            h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6', h6: 'p'
          }}
          >
            { shortDesc }
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
