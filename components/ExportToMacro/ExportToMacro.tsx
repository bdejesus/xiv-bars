/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createRef, useState } from 'react';
import { layouts, chotbarSlotNames } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import I18n from 'lib/I18n/locale/en-US';
import Modal from 'components/Modal';
import type { SlotProps } from 'types/Action';
import styles from './ExportToMacros.module.scss';

export function ExportToMacros() {
  const [showModal, setShowModal] = useState(false);
  const [macroText, setMacroText] = useState([] as string[]);
  // const [copied, setCopied] = useState(false);
  const textarea = createRef<HTMLTextAreaElement>();
  const appState = useAppState();
  const { layout } = appState;
  const layoutIndex = layout || 0;
  const currLayout = layouts[layoutIndex] as keyof typeof appState;

  const excludeTypes = [
    'MacroIcon',
    'CompanyAction'
  ];

  function generateHotbarMacros(hotbarRow: SlotProps[], hotbarNum: number) {
    return hotbarRow
      .map(({ action }, index) => {
        if (action.Name
          && action.UrlType
          && !excludeTypes.includes(action.UrlType)
        ) {
          const slotName = (currLayout === 'chotbar')
            ? chotbarSlotNames[index]
            : index + 1;
          const subcommand = action.Command || 'action';
          const stringArray = [
            `/${currLayout}`,
            subcommand,
            `"${action.Name}"`,
            hotbarNum,
            slotName
          ];

          return stringArray.join(' ');
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
      const hotbarMacros = Object.values(appState[currLayout] as SlotProps[])
        .map((row, index) => row && generateHotbarMacros(row as unknown as SlotProps[], index + 1))
        .join('\n')
        .trim()
        .split('\n');

      const macroGroups: string[] = groupMacros(hotbarMacros);
      setMacroText(macroGroups);
    }
  }

  // function selectTextarea() {
  //   textarea.current?.focus();
  //   textarea.current?.select();
  // }

  function toggleModal() {
    buildMacros();
    setShowModal(!showModal);
  }

  // function copyText() {
  //   selectTextarea();
  //   document.execCommand('copy');
  //   textarea.current?.blur();
  //   setCopied(true);
  //   setTimeout(() => { setCopied(false); }, 3000);
  // }

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
          // data-copied={copied}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{I18n.ExportToMacro.export_to_macro}</h3>
              <p>{I18n.ExportToMacro.limitations}</p>
            </div>

            <div className={styles.textareaContainer}>
              { macroText.map((text, i) => (
                <textarea ref={textarea} defaultValue={text} key={`macro-group-${i}`} readOnly />
              ))}
            </div>

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExportToMacros;
