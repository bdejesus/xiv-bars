import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './UserNav.module.scss';

export function UserNav() {
  const [showMenu, setShowMenu] = useState(false);
  const { data: session } = useSession();

  function handleSignIn() {
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
      { session ? (
        <>

          <ul className={styles.globalNav}>
            <li className={styles.navItem}>
              <Link href="/me">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>My Layouts</a>
              </Link>
            </li>
          </ul>

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
                <a href="https://www.buymeacoffee.com/bejezus" target="_blank" rel="noreferrer">
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
        </>
      ) : (
        <button type="button" onClick={handleSignIn}>Sign in</button>
      )}
    </div>
  );
}

export default UserNav;
