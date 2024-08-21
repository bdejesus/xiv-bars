import React from 'react';
import { useAppState } from 'components/App/context';
import LayoutCard from 'components/LayoutCard';
import AdUnit from 'components/AdUnit';

import type { LayoutViewProps } from 'types/Layout';

import styles from '../LayoutsList.module.scss';

interface ListCardsProps {
  layouts: LayoutViewProps[],
  listIndex: number
}

export default function ListCards({ layouts, listIndex = 1 }:ListCardsProps) {
  const { jobs } = useAppState();

  return (
    <ul className={[styles.layoutsList, 'layoutsList'].join(' ')}>
      { layouts.map((layout, index:number) => {
        const job = jobs.find((j) => j.Abbr === layout.jobId);
        if (!job) return null;
        return (
          <React.Fragment key={layout.id}>
            { ((layout.position!) % 5 === 0)
              && (
              <li>
                <AdUnit
                  id={`ad-card-${listIndex + index}`}
                  width={320}
                  format="feed"
                />
              </li>
              )}

            <li
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/HowTo"
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
