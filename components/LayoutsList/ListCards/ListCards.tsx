import React from 'react';
import { useAppState } from 'components/App/context';
import LayoutCard from 'components/LayoutCard';
import AdUnit from 'components/AdUnit';

import type { LayoutViewProps } from 'types/Layout';

import styles from '../LayoutsList.module.scss';

interface ListCardsProps {
  layouts: LayoutViewProps[],
}

export default function ListCards({ layouts }:ListCardsProps) {
  const { jobs } = useAppState();

  return (
    <ul className={[styles.layoutsList, 'layoutsList'].join(' ')}>
      { layouts.map((layout, index:number) => {
        const job = jobs.find((j) => j.Abbr === layout.jobId);
        if (!job) return null;
        return (
          <li
            itemScope
            itemProp="itemListElement"
            itemType="https://schema.org/HowTo"
            key={layout.id}
          >
            { ((layout.position!) % 11 === 0) && (
              <AdUnit width={320} format="feed" className="mb-md" />
            )}

            <meta itemProp="position" content={`${layout.position || index + 1}`} />
            <LayoutCard
              layout={layout}
              job={job}
              className={styles.card}
              hideName={false}
            />
          </li>
        );
      })}
    </ul>
  );
}
