import React from 'react';
import { useAppDispatch } from 'components/App/context';
import styles from './Hotbar.module.scss';

interface Props {
  id: string,
  defaultValue: number
}

export default function LayoutControl({ id, defaultValue }: Props) {
  const appDispatch = useAppDispatch();

  function handleLayoutControl(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.currentTarget;
    appDispatch({
      type: 'updateHotbarLayout',
      payload: {
        hbId: id,
        hbConfig: value
      }
    });
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
