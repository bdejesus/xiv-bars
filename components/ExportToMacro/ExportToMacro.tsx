/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createRef, useState } from 'react';
import { layouts, chotbarSlotNames } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';
import { useTranslation } from 'next-i18next';
import Modal from 'components/Modal';
import type { SlotProps } from 'types/Action';
import styles from './ExportToMacros.module.scss';

export function ExportToMacros() {
  const { t } = useTranslation();
  const [showMacrosModal, setShowMacrosModal] = useState(false);
  const [macroText, setMacroText] = useState([] as string[]);
  // const [copied, setCopied] = useState(false);
  const textarea = createRef<HTMLTextAreaElement>();
  const appState = useAppState();
  const { layout } = appState.viewData;
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

  function handleShowMacros() {
    buildMacros();
    setShowMacrosModal(true);
  }

  // function selectTextarea() {
  //   textarea.current?.focus();
  //   textarea.current?.select();
  // }

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
        data-title={t('ExportToMacro.export_to_macro')}
        className={`${styles.macroBtn} button btn-icon`}
        onClick={handleShowMacros}
      >
        <Icon id={Icons.MACRO} alt={t('ExportToMacro.export_to_macro')} />
        <span className="btn-label-hidden">{t('ExportToMacro.export_to_macro')}</span>
      </button>

      <Modal
        showModal={showMacrosModal}
        onClose={() => setShowMacrosModal(false)}
      >
        <div
          className={styles.exportPrompt}
          // data-copied={copied}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{t('ExportToMacro.export_to_macro')}</h3>
              <p>{t('ExportToMacro.limitations')}</p>
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
