import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { byKey } from 'lib/utils/array.mjs';
import type { LayoutViewProps } from 'types/Layout';
import dynamic from 'next/dynamic';
import ListCards from './ListCards';
import ViewControl, { defaultView } from './ViewControl';

import styles from './LayoutsList.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

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

  function applyFilter(list:LayoutViewProps[]) {
    if (!filterable) return list;

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

  function applySort(list:LayoutViewProps[]) {
    if (!filterable) return list;

    switch (viewOptions.sortBy) {
      case 'recent': return list.toSorted(byKey('updatedAt', 'desc'));
      case 'hearts': return list.toSorted((a, b) => b._count.hearts - a._count.hearts);
      default: return list;
    }
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

    if (listElements && layouts.length > 5) {
      // Get column heights and get tallest, and shortest columns
      const heights:number[] = [...listElements].map((col) => col.getBoundingClientRect().height);
      const high = Math.max(...heights);
      const low = Math.min(...heights);

      // Check if there's enough height diff that it needs to rebalance
      if ((high - low) > 240) {
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
    const filterLayouts = applyFilter(layouts);
    const sortLayouts = filterLayouts ? applySort(filterLayouts) : layouts;
    const indexedLayouts = sortLayouts.map((item, index) => ({ ...item, position: index + 1 }));
    const groupLayouts = groupIntoColumns(indexedLayouts);
    setViewLayouts(groupLayouts);
  }, [viewOptions]);

  useEffect(() => {
    if (viewLayouts) {
      const filterLayouts = applyFilter(layouts);
      const sortLayouts = filterLayouts ? applySort(filterLayouts) : layouts;
      const indexedLayouts = sortLayouts.map((item, index) => ({ ...item, position: index + 1 }));

      const groupLayouts = () => {
        if (window.matchMedia('(max-width: 720px)').matches) {
          return groupIntoColumns(indexedLayouts, 1);
        }
        if (window.matchMedia('(max-width: 980px)').matches) {
          return groupIntoColumns(indexedLayouts, 2);
        }
        return groupIntoColumns(indexedLayouts);
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
    <>
      <div
        className={[styles.container, className].join(' ')}
        itemScope={!!title}
        itemProp={title && 'itemListElement'}
        itemType={title && 'https://schema.org/ItemList'}
      >
        { title && <h2 className={styles.title} itemProp="name">{title}</h2>}
        { filterable && <ViewControl onChange={setViewOptions} id={id} /> }

        <div
          className={styles.listColumns}
          ref={listsWrapper}
          data-columns={viewLayouts?.length || 1}
        >
          { viewLayouts
            ? viewLayouts?.map((layoutsColumn, colIndex) => (
              <ListCards layouts={layoutsColumn} key={`layoutColumn-${colIndex}`} />
            )) : (
              <ListCards layouts={layouts} />
            )}
        </div>

        { link && (
          <Link href={link.href} className={styles.moreLink}>
            {link.text}
          </Link>
        )}
      </div>

      { layouts.length > 3 && (
        <AdUnit />
      )}
    </>
  );
}
