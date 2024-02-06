import React from 'react';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import { hotbarKeyPosition } from 'lib/xbars';
import { buildUrl } from 'lib/utils/url';

import styles from './Hotbar.module.scss';

interface Props {
  id: string,
  defaultValue: string
}

export default function LayoutControl({ id, defaultValue }: Props) {
  const router = useRouter();
  const { viewData } = useAppState();

  function handleLayoutControl(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.currentTarget;
    const position:number = hotbarKeyPosition(id);
    const updatedHb = value
      ? viewData.hb?.toSpliced(position, 1, parseInt(value, 10))
      : viewData.hb;

    const url = buildUrl({ query: router.query, mergeData: { hb: updatedHb } });
    router.push(url, undefined, { shallow: true });
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-onchange
    <select className={styles.layoutControl} onChange={(e) => handleLayoutControl(e)} defaultValue={defaultValue}>
      <option value={1}>
        12&times;1
      </option>
      <option value={2}>
        6&times;2
      </option>
      <option value={3}>
        4&times;3
      </option>
      <option value={4}>
        3&times;4
      </option>
      <option value={6}>
        2&times;6
      </option>
      <option value={12}>
        1&times;12
      </option>
    </select>
  );
}
