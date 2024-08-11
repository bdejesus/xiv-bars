import {
  ReactNode, useState, useEffect, useRef
} from 'react';
import Link from 'next/link';
import { byKey } from 'lib/utils/array.mjs';
import { useAppState } from 'components/App/context';
import LayoutCard from 'components/LayoutCard';
import type { LayoutViewProps } from 'types/Layout';
import ViewControl, { defaultView } from './ViewControl';

import styles from './LayoutsList.module.scss';

interface LayoutsListProps {
  id: string,
  title?: string,
  link?: {
    text: string,
    href: string
  },
  layouts: LayoutViewProps[],
  children?: ReactNode,
  className?: string,
  columns?: 3 | 4,
  filterable?: boolean
}

export default function LayoutsList({
  id,
  title,
  link,
  layouts,
  children,
  className = '',
  columns = 3,
  filterable = false
}:LayoutsListProps) {
  const { jobs } = useAppState();
  const [viewLayouts, setViewLayouts] = useState<LayoutViewProps[][]>();
  const [viewOptions, setViewOptions] = useState(defaultView);
  const [balanced, setBalanced] = useState(false);
  const [ready, setReady] = useState(false);
  const listsWrapper = useRef<HTMLDivElement>(null);
  const initColumns = Array.from({ length: columns }, () => []);

  useEffect(() => {
    const applySort = (list:LayoutViewProps[]) => {
      switch (viewOptions.sortBy) {
        case 'recent': return list.toSorted(byKey('updatedAt', 'desc'));
        case 'hearts': return list.toSorted((a, b) => b._count.hearts - a._count.hearts);
        default: return list;
      }
    };

    const applyFilter = (list:LayoutViewProps[]) => {
      const showHb = viewOptions.filters.includes('HB');
      const showXhb = viewOptions.filters.includes('XHB');
      const showPvp = viewOptions.filters.includes('PVP');
      const showPve = viewOptions.filters.includes('PVE');

      let updatedList = list;

      if (!(showPvp && showPve)) {
        if (!showPvp) {
          updatedList = updatedList.filter((l:LayoutViewProps) => !l.isPvp);
        }

        if (!showPve) {
          updatedList = updatedList.filter((l:LayoutViewProps) => l.isPvp);
        }
      }

      if (!(showHb && showXhb)) {
        if (!showXhb) {
          updatedList = updatedList.filter((l:LayoutViewProps) => l.layout !== 0);
        }

        if (!showHb) {
          updatedList = updatedList.filter((l:LayoutViewProps) => l.layout !== 1);
        }
      }

      return updatedList;
    };

    const filterLayouts = applyFilter(layouts);
    const sortLayouts = filterLayouts ? applySort(filterLayouts) : layouts;
    const listColumns = sortLayouts?.reduce<LayoutViewProps[][]>((acc, curr, index) => {
      acc[index % columns].push(curr);
      return acc;
    }, initColumns);

    setViewLayouts(listColumns);
  }, [viewOptions]);

  useEffect(() => {
    // Get all column elements
    const listCols = listsWrapper.current?.querySelectorAll('.layoutsList');

    if (ready && !balanced && listCols) {
      // Get column heights and get tallest, and shortest columns
      const heights:number[] = [...listCols].map((col) => col.getBoundingClientRect().height);
      const high = Math.max(...heights);
      const low = Math.min(...heights);

      // Check if there's enough height diff that it needs to rebalance
      if ((high - low) > 180) {
        let balanceColumns = viewLayouts!; // store a mutable copy of layouts list
        const highIndex = heights.indexOf(high);
        const lowIndex = heights.indexOf(low);
        // Remove the last item from the tallest column
        const overflowItem = balanceColumns[highIndex].splice(-1, 1)[0];
        // Add it to the shortest column
        balanceColumns[lowIndex].push(overflowItem);
        setViewLayouts(balanceColumns);
        setBalanced(true);
      }
    }
  }, [ready]);

  useEffect(() => {
    if (typeof window !== 'undefined') setReady(true);
  }, []);

  if (!layouts) return null;

  return (
    <div
      className={[styles.container, className].join(' ')}
      itemScope={!!title}
      itemProp={title && 'itemListElement'}
      itemType={title && 'https://schema.org/ItemList'}
    >
      { title && <h2 className={styles.title} itemProp="name">{title}</h2>}
      { filterable && <ViewControl onChange={setViewOptions} id={id} /> }

      <div className={styles.listColumns} ref={listsWrapper}>
        {viewLayouts?.map((layoutsColumn, columnIndex) => (
          <ul
            className={[styles.layoutsList, 'layoutsList'].join(' ')}
            key={`layoutColumn-${columnIndex}`}
          >
            {layoutsColumn?.map((layout:LayoutViewProps, index:number) => {
              const job = jobs.find((j) => j.Abbr === layout.jobId);
              if (!job) return null;
              return (
                <li
                  key={layout.id}
                  itemScope
                  itemProp="itemListElement"
                  itemType="https://schema.org/HowToTip"
                >
                  <meta itemProp="position" content={`${index + 1}`} />
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
        ))}
      </div>

      { link && (
        <Link href={link.href} className={styles.moreLink}>
          {link.text}
        </Link>
      )}
    </div>
  );
}
