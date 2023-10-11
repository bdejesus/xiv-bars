/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */
import { useAppState } from 'components/App/context';
import { hasActions } from 'lib/xbars';
import { SlotProps } from 'types/Action';
import Bar from './Bar';
import Settings from './Settings';
import styles from './Xbar.module.scss';

export function Xbar() {
  const {
    chotbar, wxhb, xhb, exhb, viewData, readOnly
  } = useAppState();

  if (!chotbar) return null;

  const hbKeys = Object.keys(chotbar);

  return (
    <>
      { !(viewData && readOnly) && <Settings />}

      <div className={styles.container}>
        {hbKeys.map((xbar) => (!readOnly || hasActions(chotbar[xbar])) && (
          <div
            key={xbar}
            className={[styles.xbar, styles[xbar]].join(' ')}
            data-main={xbar === hbKeys[xhb - 1]}
            data-wxhb={xbar === hbKeys[wxhb - 1]}
            data-exhb={xbar === hbKeys[exhb - 1]}
          >
            <Bar bar={chotbar[xbar] as SlotProps[]} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Xbar;
