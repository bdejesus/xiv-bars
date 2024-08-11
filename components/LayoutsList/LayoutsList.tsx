import { useState, useEffect, useRef } from 'react';
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
  className?: string,
  columns?: 3 | 4,
  filterable?: boolean
}

export default function LayoutsList({
  id,
  title,
  link,
  layouts,
  className = '',
  columns = 3,
  filterable = false
}:LayoutsListProps) {
  const { jobs } = useAppState();
  const [viewLayouts, setViewLayouts] = useState<LayoutViewProps[][]>();
  const [viewOptions, setViewOptions] = useState(defaultView);
  const [balanced, setBalanced] = useState(false);
  const [ready, setReady] = useState(false);
  const [windowSize, setWindowSize] = useState<{height?:number, width?:number}>({
    height: undefined,
    width: undefined
  });
  const listsWrapper = useRef<HTMLDivElement>(null);

  function handleResize() {
    setWindowSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  function applySort(list:LayoutViewProps[]) {
    switch (viewOptions.sortBy) {
      case 'recent': return list.toSorted(byKey('updatedAt', 'desc'));
      case 'hearts': return list.toSorted((a, b) => b._count.hearts - a._count.hearts);
      default: return list;
    }
  }

  function applyFilter(list:LayoutViewProps[]) {
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
  }

  function groupIntoColumns(list:LayoutViewProps[], columnCount:number = columns) {
    const initColumns = Array.from({ length: columnCount }, () => []);
    setBalanced(false);
    return list?.reduce<LayoutViewProps[][]>((acc, curr, index) => {
      acc[index % columnCount].push(curr);
      return acc;
    }, initColumns);
  }

  function balanceColumns(list:LayoutViewProps[][]) {
    // Get all column elements
    const listElements = listsWrapper.current?.querySelectorAll('.layoutsList');

    if (listElements && layouts.length > 6) {
      // Get column heights and get tallest, and shortest columns
      const heights:number[] = [...listElements].map((col) => col.getBoundingClientRect().height);
      const high = Math.max(...heights);
      const low = Math.min(...heights);

      // Check if there's enough height diff that it needs to rebalance
      if ((high - low) > 180) {
        const rebalancedColumns = list; // store a mutable copy of layouts list
        const highIndex = heights.indexOf(high);
        const lowIndex = heights.indexOf(low);
        // Remove the last item from the tallest column
        const overflowItem = rebalancedColumns[highIndex]?.splice(-1, 1)[0];
        // Add it to the shortest column
        rebalancedColumns[lowIndex].push(overflowItem);
        setBalanced(true);
        return rebalancedColumns;
      }
    }

    return list;
  }

  useEffect(() => {
    const filterLayouts = filterable ? applyFilter(layouts) : layouts;
    const sortLayouts = (filterable && filterLayouts) ? applySort(filterLayouts) : layouts;
    const groupLayouts = groupIntoColumns(sortLayouts);
    setViewLayouts(groupLayouts);
  }, [viewOptions]);

  useEffect(() => {
    if (viewLayouts) {
      const filterLayouts = applyFilter(layouts);
      const sortLayouts = filterLayouts ? applySort(filterLayouts) : layouts;

      const groupLayouts = () => {
        if (window.matchMedia('(max-width: 720px)').matches) {
          return groupIntoColumns(sortLayouts, 1);
        }
        if (window.matchMedia('(max-width: 980px)').matches) {
          return groupIntoColumns(sortLayouts, 2);
        }
        return groupIntoColumns(sortLayouts);
      };

      const groupedLayouts = groupLayouts();
      setViewLayouts(groupedLayouts);
    }
  }, [windowSize]);

  useEffect(() => {
    handleResize();
  }, [ready]);

  useEffect(() => {
    if (ready && !balanced && viewLayouts) {
      const balancedLayouts = balanceColumns(viewLayouts);
      setViewLayouts(balancedLayouts);
    }
  }, [balanced]);

  useEffect(() => {
    if (ready && !balanced && listsWrapper.current && viewLayouts) {
      const rebalancedColumns = balanceColumns(viewLayouts);
      setViewLayouts(rebalancedColumns);
    }
  }, [listsWrapper.current]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReady(true);
      window.addEventListener('resize', handleResize);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
