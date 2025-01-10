import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Icon from 'components/Icon';
import styles from './LanguagePicker.module.scss';

export default function LanguagePicker() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [router.locale]);

  function handleKeyPress(e:React.KeyboardEvent<HTMLElement>) {
    if (e.code === 'Enter') setShowMenu(!showMenu);
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`button btn-default btn-menu ${styles.container}`}
        onClick={() => setShowMenu(!showMenu)}
        onKeyUp={handleKeyPress}
      >
        <Icon id="locale" alt={router.locale!} />
        <div className="btn-label">
          {router.locale}
        </div>
      </button>

      <ul className={styles.menu} aria-hidden={!showMenu}>
        <li>
          <Link href={decodeURIComponent(router.asPath)} locale="en">
            EN - English
          </Link>
        </li>
        <li>
          <Link href={decodeURIComponent(router.asPath)} locale="ja">
            JA - 日本語
          </Link>
        </li>
        <li>
          <Link href={decodeURIComponent(router.asPath)} locale="de">
            DE - Deutsch
          </Link>
        </li>
        <li>
          <Link href={decodeURIComponent(router.asPath)} locale="fr">
            FR - Français
          </Link>
        </li>
      </ul>
    </div>
  );
}
