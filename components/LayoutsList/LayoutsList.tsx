import { ReactNode } from 'react';
import Link from 'next/link';
import { useAppState } from 'components/App/context';
import LayoutCard from 'components/LayoutCard';
import type { LayoutViewProps } from 'types/Layout';
import styles from './LayoutsList.module.scss';

interface LayoutsListProps {
  title?: string,
  link?: {
    text: string,
    href: string
  },
  layouts: LayoutViewProps[],
  children?: ReactNode,
  className?: string,
  columns?: 3 | 4
}

export default function LayoutsList({
  title,
  link,
  layouts,
  children,
  className = '',
  columns
}:LayoutsListProps) {
  const { jobs } = useAppState();

  if (!layouts) return null;

  return (
    <div
      className={[styles.container, className].join(' ')}
      itemScope={!!title}
      itemProp={title && 'itemListElement'}
      itemType={title && 'https://schema.org/ItemList'}
    >
      { title && <h2 className={styles.title} itemProp="name">{title}</h2>}

      <ul className={[styles.layoutsList, 'layoutsList'].join(' ')} data-columns={columns}>
        {layouts.map((layout:LayoutViewProps, index:number) => {
          const job = jobs.find((j) => j.Abbr === layout.jobId);
          if (!job) return null;
          return (
            <li
              key={layout.id}
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/HowToTip"
            >
              <meta itemProp="position" content={`${index + 1}`}/>
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
