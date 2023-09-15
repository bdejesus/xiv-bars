/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */
import { useAppState } from 'components/App/context';
import Bar from './Bar';
import Settings from './Settings';
import styles from './Xbar.module.scss';

export function Xbar() {
  const {
    chotbar, wxhb, xhb, exhb, viewData, readOnly
  } = useAppState();
  const hbKeys = Object.keys(chotbar);

  function hasActions(xbar) {
    const slottedActions = xbar.map((a) => Object.keys(a.action).length > 0);
    return slottedActions.includes(true);
  }

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
            <Bar bar={chotbar[xbar]} id={xbar} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Xbar;
