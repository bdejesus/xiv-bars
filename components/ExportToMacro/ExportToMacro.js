/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react';
import { layouts, chotbarSlotNames } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import I18n from 'lib/I18n/locale/en-US';
import CloseButton from 'components/CloseButton';
import Modal from 'components/Modal';
import styles from './ExportToMacros.module.scss';

function ExportToMacros() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const textarea = useRef();
  const appState = useAppState();
  const { layout } = appState;
  const currLayout = layouts[layout];

  const excludeTypes = [
    'MacroIcon',
    'CompanyAction'
  ];

  function generateHotbarMacros(hotbarRow, hotbarNum) {
    return hotbarRow
      .map(({ action }, index) => {
        if (action.Name && !excludeTypes.includes(action.UrlType)) {
          const slotName = (currLayout === 'chotbar')
            ? chotbarSlotNames[index]
            : index + 1;
          const subcommand = action.Command || 'action';
          const strArray = [
            `/${currLayout}`,
            subcommand,
            `"${action.Name}"`,
            hotbarNum,
            slotName
          ];

          return strArray.join(' ');
        }
        return null;
      })
      .filter((row) => row)
      .join('\n');
  }

  function buildMacros() {
    const hotbarMacros = Object
      .values(appState[currLayout])
      .map((row, index) => generateHotbarMacros(row, index + 1))
      .join('\n')
      .trim();

    textarea.current.value = hotbarMacros;
  }

  function selectTextarea() {
    textarea.current.focus();
    textarea.current.select();
  }

  function toggleModal() {
    buildMacros();
    setShowModal(!showModal);
  }

  function copyText() {
    selectTextarea();
    document.execCommand('copy');
    textarea.current.blur();
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.macroBtn}
        title="Export to Macro"
        onClick={toggleModal}
      >
        {I18n.ExportToMacro.export_to_macro}
      </button>

      <Modal toClose={toggleModal} hidden={!showModal}>
        <div
          className={styles.exportPrompt}
          data-copied={copied}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={toggleModal} />

            <div className={styles.modalHeader}>
              <h3>{I18n.ExportToMacro.export_to_macro}</h3>
              <p>{I18n.ExportToMacro.limitations}</p>
            </div>

            <textarea ref={textarea} readOnly onClick={selectTextarea} />

            <div className={styles.modalFooter}>
              <button type="button" onClick={copyText}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExportToMacros;
