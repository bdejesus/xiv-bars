import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import analytics from 'lib/analytics';
import styles from './UserNav.module.scss';

export function UserNav() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  function handleSignIn() {
    analytics.event({
      action: 'login',
      params: { method: 'discord' }
    });
    signIn('discord', { callbackUrl: '/' });
  }

  function handleSignOut(e) {
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
          <a href="https://github.com/bdejesus/xiv-bars/blob/main/CHANGELOG.md">What’s New</a>
        </li>

        { session && (
          <li className={styles.navItem}>
            <a href="/me" data-active={router.pathname === '/me'}>My Layouts</a>
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
            <div className={styles.title}>
              {session.user.name || session.user.email}
            </div>
            <div className={styles.profileImage}>
              <img
                src={session.user.image}
                alt={session.user.name || session.user.email}
              />
            </div>
          </div>

          <ul
            className={styles.menu}
            data-active={showMenu}
            onMouseLeave={toggleMenu}
          >
            <li className={styles.navItem}>
              <a
                href="https://www.buymeacoffee.com/bejezus"
                target="_blank"
                rel="noreferrer"
                onClick={() => analytics.event({
                  action: 'click',
                  params: {
                    method: 'donate'
                  }
                })}
              >
                Donate
              </a>
            </li>
            <li className={styles.navItem}>
              <a
                className={styles.logout}
                href="/api/auth/signout"
                onClick={handleSignOut}
              >
                Log out
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <button type="button" onClick={handleSignIn}>
          Discord Sign in
        </button>
      )}
    </div>
  );
}

export default UserNav;
