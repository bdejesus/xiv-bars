import React from 'react';
import { useAppState } from 'components/App/context';
import LayoutCard from 'components/LayoutCard';
import dynamic from 'next/dynamic';

import type { LayoutViewProps } from 'types/Layout';

import styles from '../LayoutsList.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

interface ListCardsProps {
  layouts: LayoutViewProps[],
}

export default function ListCards({ layouts }:ListCardsProps) {
  const { jobs } = useAppState();

  function shouldInsertAdUnit(position:number) {
    return ((position % 11 === 0) || position === 6);
  }

  return (
    <ul className={[styles.layoutsList, 'layoutsList'].join(' ')}>
      { layouts.map((layout, index:number) => {
        const job = jobs.find((j) => j.Abbr === layout.jobId);
        if (!job) return null;
        return (
          <React.Fragment key={layout.id}>
            { shouldInsertAdUnit(layout.position || 0) && (
              <li>
                <AdUnit format="largeRect" id={`ad-ListCards-${layout.id}`} />
              </li>
            )}
            <li
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/HowTo"
              key={layout.id}
            >
              <meta itemProp="position" content={`${layout.position || index + 1}`} />
              <LayoutCard
                layout={layout}
                job={job}
                className={styles.card}
                hideName={false}
              />
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
}
