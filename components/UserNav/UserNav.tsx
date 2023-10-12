import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import I18n from 'lib/I18n/locale/en-US';
import analytics from 'lib/analytics';
import styles from './UserNav.module.scss';

export function UserNav() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  function handleSignIn() {
    analytics.event({ action: 'login', params: { method: 'discord' } });
    signIn('discord', { callbackUrl: '/' });
  }

  function handleSignOut(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  }

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  return (
    <div className={styles.userNav}>
      <ul className={styles.globalNav}>
        <li className={styles.navItem}>
          <a
            href="https://www.buymeacoffee.com/bejezus"
            target="_blank"
            rel="noreferrer"
            onClick={() => analytics.event({
              action: 'click',
              params: { method: 'donate' }
            })}
          >
            {I18n.UserNav.donate}
          </a>
        </li>

        { session && (
          <li className={styles.navItem}>
            <a href="/me" data-active={router.pathname === '/me'}>
              {I18n.UserNav.my_layouts}
            </a>
          </li>
        )}
      </ul>

      { session ? (
        <div className={styles.profileNav}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            className={styles.profile}
            onClick={toggleMenu}
            role="button"
            tabIndex={0}
            data-active={showMenu}
          >
            <div className={styles.profileImage}>
              <img
                src={session.user.image}
                alt={session.user.name || session.user.email}
              />
            </div>
            <div className={styles.title}>
              {session.user.name || session.user.email}
            </div>
          </div>

          <ul
            className={styles.menu}
            data-active={showMenu}
            onMouseLeave={toggleMenu}
          >
            <li className={styles.navItem}>
              <a
                href="https://github.com/bdejesus/xiv-bars/issues/new"
                target="_blank"
                rel="noreferrer"
              >
                {I18n.UserNav.report_an_issue}
              </a>
            </li>

            <li className={styles.navItem}>
              <a
                className={styles.logout}
                href="/api/auth/signout"
                onClick={handleSignOut}
              >
                {I18n.UserNav.logout}
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSignIn}
          className={styles.signin}
        >
          {I18n.UserNav.signin_with_discord}
        </button>
      )}
    </div>
  );
}

export default UserNav;
