import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import analytics from 'lib/analytics';
import styles from './UserNav.module.scss';

export default function UserNav({ className }:{ className?: string}) {
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

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  function handleDonate(e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    analytics.event({
      action: 'click',
      params: { id: 'donate' }
    });
    router.push(e.currentTarget.getAttribute('href')!);
  }

  return (
    <div className={`${styles.userNav} ${className}`}>
      <ul className={styles.globalNav}>
        <li className={styles.navItem}>
          <a
            href="https://www.buymeacoffee.com/bejezus"
            target="_blank"
            rel="noreferrer"
            onClick={handleDonate}
            className={`${styles.donateLink} button btn-primary`}
            data-title={t('UserNav.donate_title')}
          >
            <span className={styles.donateLabel}>
              {t('UserNav.donate')}
            </span>
          </a>
        </li>
      </ul>

      { session ? (
        <div className={styles.profileNav}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            className={`${styles.profile} button btn-clear`}
            onClick={toggleMenu}
            role="button"
            tabIndex={0}
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
            onMouseLeave={toggleMenu}
          >
            <li className={styles.navItem}>
              <Link href={`/user/${session.user.id}`}>
                {t('UserNav.my_layouts')}
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

UserNav.defaultProps = {
  className: ''
};
