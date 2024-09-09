/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { layouts, chotbarSlotNames, hasActions } from 'lib/xbars';
import { translateData } from 'lib/utils/i18n.mjs';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';
import { useTranslation } from 'next-i18next';
import Modal from 'components/Modal';
import type { SlotProps } from 'types/Action';
import Textarea from './Textarea';
import styles from './ExportToMacros.module.scss';

export function ExportToMacros() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showMacrosModal, setShowMacrosModal] = useState(false);
  const [macroText, setMacroText] = useState([] as string[]);
  const appState = useAppState();

  const excludeTypes = [
    'MainCommand',
    'MacroIcon',
    'CompanyAction'
  ];

  function handleExport() {
    setShowMacrosModal(true);
  }

  useEffect(() => {
    const { layout, isPvp } = appState.viewData;
    const layoutIndex = layout || 0;
    const currLayout = layouts[layoutIndex] as keyof typeof appState;

    function generateHotbarMacros(hotbarRow: SlotProps[], hotbarNum: number) {
      return hotbarRow
        .map(({ action }, index) => {
          if (action
            && action.Name
            && action.UrlType
            && !excludeTypes.includes(action.UrlType as string)
          ) {
            const command = [isPvp ? 'pvp' : '', currLayout].join('');
            const subcommand = action.Command || 'action';
            const slotName = (currLayout === 'chotbar') ? chotbarSlotNames[index] : index + 1;
            const stringArray = [
              `/${command}`,
              subcommand,
              `"${translateData('Name', action, router.locale)}"`,
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
        const hotbarRows = Object.values(appState[currLayout]!);
        const hotbarMacros = hotbarRows
          .map((row, index) => row && generateHotbarMacros(row as unknown as SlotProps[], index + 1))
          .filter((line) => line)
          .join('\n')
          .trim()
          .split('\n');

        const clearMacro = hotbarRows.reduce((collectKeys:string[], hbRow, index) => {
          if (hasActions(hbRow)) {
            return [...collectKeys, `/${currLayout} remove ${index + 1} all`];
          }
          return collectKeys;
        }, []).join('\n');

        const macroGroups:string[] = groupMacros(hotbarMacros);
        setMacroText([clearMacro, ...macroGroups]);
      }
    }

    buildMacros();
  }, [appState.viewData]);

  useEffect(() => () => setMacroText([]), []);

  return (
    <div className={styles.container}>
      <button
        type="button"
        data-title={t('ExportToMacro.export_to_macro')}
        className={`${styles.macroBtn} button`}
        onClick={() => handleExport()}
      >
        <Icon id={Icons.MACRO} alt={t('ExportToMacro.export_to_macro')} />
        <span className="btn-label">{t('ExportToMacro.export_to_macro')}</span>
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
              <h2>{t('ExportToMacro.export_to_macro')}</h2>
              <p>{t('ExportToMacro.limitations')}</p>
            </div>

            <div className={styles.textareaContainer}>
              { macroText.map((text, i) => (
                <Textarea
                  key={`macro-group-${i}`}
                  id={i}
                  value={text}
                />
              ))}
            </div>

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExportToMacros;
