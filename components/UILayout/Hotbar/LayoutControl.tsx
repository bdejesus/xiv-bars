import React from 'react';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import { hotbarKeyPosition } from 'lib/xbars';

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
    const configValue:number = parseInt(value, 10);
    const updatedHb = configValue
      ? viewData.hb.split(',')?.toSpliced(position, 1, value)
      : viewData.hb;
    const { query, pathname } = router;
    const queryParams = { pathname, query: { ...query, hb: updatedHb?.toString() } };
    router.push(queryParams, undefined, { shallow: true });
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
