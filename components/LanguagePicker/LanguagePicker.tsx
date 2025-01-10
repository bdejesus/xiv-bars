import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Icon from 'components/Icon';
import { languages } from 'lib/utils/i18n.mjs';
import styles from './LanguagePicker.module.scss';

export default function LanguagePicker() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [router.locale]);

  function handleKeyUp(e:React.KeyboardEvent<HTMLElement>) {
    if (e.code === 'Enter') setShowMenu(!showMenu);
    if (e.code === 'Escape') setShowMenu(false);
  }

  return (
    <div
      className={styles.container}
      onMouseLeave={() => setShowMenu(false)}
    >
      <button
        type="button"
        className={`button btn-default btn-menu ${styles.container}`}
        onClick={() => setShowMenu(!showMenu)}
        onKeyUp={handleKeyUp}
        title={languages[router.locale as keyof typeof languages]}
      >
        <Icon id="locale" alt={router.locale!} />
        <div className={styles.locale}>
          {router.locale}
        </div>
      </button>

      <ul className={styles.menu} aria-hidden={!showMenu}>
        { Object.entries(languages).map(([locale, label]) => (
          <li key={`locale-option-${locale}`}>
            <Link href={decodeURIComponent(router.asPath)} locale={locale}>
              <span className={styles.locale}>{locale}</span>&nbsp;- {label}
            </Link>
          </li>
        )) }
      </ul>
    </div>
  );
}
