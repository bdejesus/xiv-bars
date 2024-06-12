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
  className,
  columns
}:LayoutsListProps) {
  const { jobs } = useAppState();

  if (!layouts) return null;

  return (
    <div className={[styles.container, className].join(' ')}>
      { title && <h2 className={styles.title}>{title}</h2>}

      <ul className={[styles.layoutsList, 'layoutsList'].join(' ')} data-columns={columns}>
        {layouts.map((layout:LayoutViewProps) => {
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

      { link && (
        <Link href={link.href} className={styles.moreLink}>
          {link.text}
        </Link>
      )}
    </div>
  );
}

LayoutsList.defaultProps = {
  children: undefined,
  className: undefined,
  title: undefined,
  link: undefined,
  columns: 3
};
