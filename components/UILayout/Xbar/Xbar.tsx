/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import { hasActions } from 'lib/xbars';
import type { SlotProps } from 'types/Action';
import Bar from './Bar';
import Settings from './Settings';
import styles from './Xbar.module.scss';

type QueryParams = {
  xhb?: string | undefined,
  wxhb?: string | undefined,
  exhb?: string | undefined
}

export function Xbar() {
  const {
    chotbar, viewData, readOnly
  } = useAppState();

  const router = useRouter();
  const { xhb, wxhb, exhb }:QueryParams = router.query;

  if (!chotbar) return null;

  const chotbarKeys = Object.keys(chotbar);

  const settings = {
    xhb: xhb ? parseInt(xhb, 10) : 0,
    wxhb: wxhb ? parseInt(wxhb, 10) : 0,
    exhb: exhb ? parseInt(exhb, 10) : 0
  };

  return (
    <>
      { !(viewData && readOnly) && <Settings />}

      <div className={styles.container}>
        {chotbarKeys.map((chotbarID) => {
          const barSet = chotbar[chotbarID] as SlotProps[];
          return (!readOnly || hasActions(barSet)) && (
            <div
              key={chotbarID}
              className={[styles.xbar, styles[chotbarID]].join(' ')}
              data-main={chotbarID === chotbarKeys[settings.xhb - 1]}
              data-wxhb={chotbarID === chotbarKeys[settings.wxhb - 1]}
              data-exhb={chotbarID === chotbarKeys[settings.exhb - 1]}
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
