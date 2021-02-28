import React, { useEffect, useRef, useState } from 'react';
import { layouts, chotbarNames } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import styles from './ExportToMacros.module.scss';

function Export() {
  const [showModal, setShowModal] = useState(false);
  const textarea = useRef();
  const modal = useRef();
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

  function selectTextarea() {
    textarea.current.focus();
    textarea.current.select();
  }

  function toggleModal() {
    setShowModal(!showModal);
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
        onClick={toggleModal}
      >
        M
      </button>

      <div
        className={styles.modal}
        data-active={showModal}
        ref={modal}
        onClick={toggleModal}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <textarea ref={textarea} readOnly onClick={selectTextarea} />
        </div>
      </div>
    </div>
  );
}

export default Export;
