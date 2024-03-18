import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import I18n from 'lib/I18n/locale/en-US';
import analytics from 'lib/analytics';
import styles from './UserNav.module.scss';

export default function UserNav({ className }:{ className?: string}) {
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
    <div className={`${styles.userNav} ${className}`}>
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
            className={[styles.donateLink, 'button btn-primary'].join(' ')}
          >
            {I18n.UserNav.donate}
          </a>
        </li>

        { session && (
          <li className={styles.navItem}>
            <Link
              href={`/user/${session.user.id}`}
              data-active={router.pathname === '/me'}
              className="button btn-clear"
            >
              {I18n.UserNav.my_layouts}
            </Link>
          </li>
        )}
      </ul>

      { session ? (
        <div className={styles.profileNav}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            className={`${styles.profile} button`}
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
            <div className={styles.title}>
              {session.user.name}
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
          className={`${styles.signin} button btn-alt`}
        >
          {I18n.UserNav.signin_with_discord}
        </button>
      )}
    </div>
  );
}

UserNav.defaultProps = {
  className: ''
};
