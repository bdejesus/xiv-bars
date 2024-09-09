import { useState, createRef } from 'react';
import { useTranslation } from 'next-i18next';
import Icon, { Icons } from 'components/Icon';

import styles from './Textarea.module.scss';

interface TextareaProps {
  id: number,
  value?: string | number
}
export default function Textarea({ id, value }:TextareaProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const textarea = createRef<HTMLTextAreaElement>();

  function copyText() {
    textarea.current?.select();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
  }

  return (
    <fieldset className={styles.textareaWrapper} data-copied={copied}>
      <legend>Macro { id }</legend>
      <textarea
        ref={textarea}
        value={value}
        id={`macro-textarea-${id}`}
      />
      <button
        type="button"
        className={`${styles.copyButton} button btn-sm btn-alt btn-icon`}
        data-title={copied
          ? t('ExportToMacro.copied')
          : t('ExportToMacro.copy_to')}
        data-title-anchor="right"
        data-macro-textarea={`textarea-${id}`}
        onClick={copyText}
      >
        <Icon id={Icons.COPY_TO} alt={t('ExportToMacro.copy_to_icon_alt')} />
        <span className="btn-label-hidden">
          { copied ? t('ExportToMacro.copied') : t('ExportToMacro.copy_to') }
        </span>
      </button>
    </fieldset>
  );
}
