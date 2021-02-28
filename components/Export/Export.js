import React, { useState, useEffect, useRef } from 'react';
import { layouts, chotbarNames } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import styles from './Export.module.scss';

function Export() {
  const textarea = useRef();
  const appState = useAppState();
  const { layout, encodedSlots } = appState;
  const currLayout = layouts[layout];

  function generateHotbarMacros(hotbarRow, hotbarNum) {
    return hotbarRow
      .map(({ action }, index) => {
        if (action.Name) {
          const slotName = (currLayout === 'chotbar') ? chotbarNames[index] : index + 1;
          return `/${currLayout} action "${action.Name}" ${hotbarNum} ${slotName}`;
        }
        return null;
      })
      .filter((row) => row)
      .join('\n');
  }

  useEffect(() => {
    const hotbarMacros = Object
      .values(appState[currLayout])
      .map((row, index) => generateHotbarMacros(row, index + 1))
      .join('\n')
      .trim();
    textarea.current.value = hotbarMacros;
  }, [layout, encodedSlots]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.macroBtn}
        title="Export to Macro"
      >
        M
      </button>

      <div className={styles.modal}>
        <textarea ref={textarea} />
      </div>
    </div>
  );
}

export default Export;
