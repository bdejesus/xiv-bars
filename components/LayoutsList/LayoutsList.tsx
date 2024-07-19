import { ReactNode, useState, useEffect } from 'react';
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
  columns,
  filterable = false
}:LayoutsListProps) {
  const { jobs } = useAppState();
  const [viewLayouts, setViewLayouts] = useState(layouts);
  const [viewOptions, setViewOptions] = useState(defaultView);

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
    setViewLayouts(sortLayouts);
  }, [viewOptions]);

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

      <ul className={[styles.layoutsList, 'layoutsList'].join(' ')} data-columns={columns}>
        {viewLayouts?.map((layout:LayoutViewProps, index:number) => {
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

      { link && (
        <Link href={link.href} className={styles.moreLink}>
          {link.text}
        </Link>
      )}
    </div>
  );
}
