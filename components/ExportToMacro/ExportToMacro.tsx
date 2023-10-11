/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createRef, useState } from 'react';
import { layouts, chotbarSlotNames } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import I18n from 'lib/I18n/locale/en-US';
import Modal from 'components/Modal';
import { SlotType } from 'types/Action';
import styles from './ExportToMacros.module.scss';

export function ExportToMacros() {
  const [showModal, setShowModal] = useState(false);
  const [macroText, setMacroText] = useState('');
  const [copied, setCopied] = useState(false);
  const textarea = createRef<HTMLTextAreaElement>();
  const appState = useAppState();
  const { layout } = appState;
  const currLayout = layout ? layouts[layout] as keyof typeof appState : undefined;

  const excludeTypes = [
    'MacroIcon',
    'CompanyAction'
  ];

  function generateHotbarMacros(hotbarRow: SlotType[], hotbarNum: number) {
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

  function groupMacros(lines: string[]) {
    const size = 15;
    const groups = [];

    for (let i = 0; i < lines.length; i += size) {
      groups.push(lines.slice(i, i + size).join('\n'));
    }
    return groups;
  }

  function buildMacros() {
    if (currLayout) {
      const hotbarMacros = Object
        .values(appState[currLayout])
        .map((row, index) => generateHotbarMacros(row as SlotType[], index + 1))
        .join('\n')
        .trim()
        .split('\n');

      const macroGroups = groupMacros(hotbarMacros).join('\n\n');
      setMacroText(macroGroups);
    }
  }

  function selectTextarea() {
    textarea.current?.focus();
    textarea.current?.select();
  }

  function toggleModal() {
    buildMacros();
    setShowModal(!showModal);
  }

  function copyText() {
    selectTextarea();
    document.execCommand('copy');
    textarea.current?.blur();
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
        <img src="/images/icon-macro.svg" className="btn-icon" alt="Macro Icon" />
        {I18n.ExportToMacro.export_to_macro}
      </button>

      <Modal toClose={() => toggleModal()} hidden={!showModal}>
        <div
          className={styles.exportPrompt}
          data-copied={copied}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{I18n.ExportToMacro.export_to_macro}</h3>
              <p>{I18n.ExportToMacro.limitations}</p>
            </div>

            <textarea ref={textarea} defaultValue={macroText} />

            <div className="modal-footer">
              <button type="button" onClick={copyText}>
                {copied
                  ? I18n.ExportToMacro.copied
                  : I18n.ExportToMacro.copy}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExportToMacros;
