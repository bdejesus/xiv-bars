import { ReactNode } from 'react';
import { useAppState } from 'components/App/context';
import LayoutCard from 'components/LayoutCard';
import type { ViewDataProps } from 'types/Layout';
import styles from './LayoutsList.module.scss';

interface LayoutsListProps {
  children?: ReactNode,
  layouts: ViewDataProps[]
}

export default function LayoutsList({ layouts, children }:LayoutsListProps) {
  const { jobs } = useAppState();

  return (
    <ul className={styles.layoutsList}>
      {layouts.map((layout:ViewDataProps) => {
        const job = jobs.find((j) => j.Abbr === layout.jobId);
        if (!job) return null;
        return (
          <li key={layout.id}>
            <LayoutCard
              layout={layout}
              job={job}
              className={styles.card}
              hideName={false}
            />
          </li>
        );
      })}

      { children && children }
    </ul>
  );
}

LayoutsList.defaultProps = {
  children: undefined
};
