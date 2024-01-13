/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */

import { useAppState } from 'components/App/context';
import { hasActions } from 'lib/xbars';
import type { SlotProps } from 'types/Action';
import Bar from './Bar';
import Settings from './Settings';
import styles from './Xbar.module.scss';

export function Xbar({ chotbar }:{ chotbar: {[key:string]:object}}) {
  const {
    layoutId, readOnly, xhb, wxhb, exhb
  } = useAppState();

  if (!chotbar) return null;

  const chotbarKeys = Object.keys(chotbar);

  return (
    <>
      { !(layoutId && readOnly) && <Settings />}

      <div className={styles.container}>
        {chotbarKeys.map((chotbarID) => {
          const barSet = chotbar[chotbarID] as SlotProps[];
          return (!readOnly || hasActions(barSet)) && (
            <div
              key={chotbarID}
              className={[styles.xbar, styles[chotbarID]].join(' ')}
              data-main={xhb ? chotbarID === chotbarKeys[xhb - 1] : false}
              data-wxhb={wxhb ? chotbarID === chotbarKeys[wxhb - 1] : false}
              data-exhb={exhb ? chotbarID === chotbarKeys[exhb - 1] : false}
            >
              <Bar bar={barSet} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Xbar;
