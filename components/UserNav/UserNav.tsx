import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import analytics from 'lib/analytics';
import { localizePath } from 'lib/utils/i18n.mjs';
import LanguagePicker from 'components/LanguagePicker';
import styles from './UserNav.module.scss';

interface UserNavProps {
  className?: string
}

export default function UserNav({ className = '' }:UserNavProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  function handleSignIn() {
    analytics.event({ action: 'login', params: { method: 'discord' } });
    signIn('discord', { callbackUrl: router.asPath });
  }

  function handleSignOut(e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  }

  function handleProfileKeyup(e:React.KeyboardEvent<HTMLElement>) {
    if (e.code === 'Enter') setShowMenu(!showMenu);
    if (e.code === 'Escape') setShowMenu(false);
  }

  return (
    <div className={`${styles.userNav} ${className}`}>
      <LanguagePicker />

      { session ? (
        <div
          className={styles.profileNav}
          onClick={() => setShowMenu(!showMenu)}
          onMouseLeave={() => setShowMenu(false)}
          onKeyUp={handleProfileKeyup}
          role="button"
          tabIndex={0}
        >
          <div
            className={`${styles.profile} button btn-clear`}
            data-active={showMenu}
          >
            <div className={styles.profileImage}>
              <img
                src={session.user.image}
                alt={session.user.name}
              />
            </div>
            <div className={styles.profileTitle}>
              {session.user.name}
            </div>
          </div>

          <ul
            className={styles.menu}
            data-active={showMenu}
          >
            <li className={styles.navItem}>
              <Link href={localizePath(`/user/${session.user.id}`, router.locale)}>
                {t('UserNav.my_layouts')}
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link href={localizePath('/user/settings', router.locale)}>
                {t('UserNav.account_settings')}
              </Link>
            </li>

            <li className={styles.navItem}>
              <a
                href="https://github.com/bdejesus/xiv-bars/issues/new/choose"
                target="_blank"
                rel="noreferrer"
              >
                {t('UserNav.report_an_issue')}
              </a>
            </li>

            <li className={styles.navItem}>
              <a
                className={styles.logout}
                href="/api/auth/signout"
                onClick={handleSignOut}
              >
                {t('UserNav.logout')}
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSignIn}
          className={`${styles.signin} button btn-alt`}
        >
          {t('UserNav.signin_with_discord')}
        </button>
      )}
    </div>
  );
}
