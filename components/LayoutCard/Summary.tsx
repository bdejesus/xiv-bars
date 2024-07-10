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
  job: ClassJobProps
}

export default function Summary({
  id,
  title,
  description = undefined,
  job
}:SummaryProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const layoutUrl = `/job/${job.Abbr}/${id}`;

  function handleClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
    router.push(layoutUrl);
    e.preventDefault();
  }

  function handleKeyPress(e:React.KeyboardEvent<HTMLElement>) {
    if (e.code === 'Enter') router.push(layoutUrl);
  }

  return (
    <div
      className={styles.summary}
      role="button"
      onClick={handleClick}
      tabIndex={0}
      onKeyUp={handleKeyPress}
    >
      <a href={layoutUrl} itemProp="url">
        <h3 title={title} itemProp="name">{title}</h3>
      </a>

      <span className={styles.subtitle} itemProp="description" aria-hidden="true">
        { t('Pages.Job.short_description', { jobName: job.Name }) }
      </span>

      <div className={styles.description} itemProp="text">
        { description && (
          <ReactMarkdown components={{
            h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6', h6: 'p'
          }}
          >
            {description}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
