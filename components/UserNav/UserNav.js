import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './UserNav.module.scss';

export function UserNav() {
  const [showMenu, setShowMenu] = useState(false);
  const { data: session } = useSession();

  function handleSignIn() {
    signIn('google', { callbackUrl: '/' });
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
              <Link href="/player/me">
                <a>My Layouts</a>
              </Link>
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
        </>
      ) : (
        <button type="button" onClick={handleSignIn}>Sign in</button>
      )}
    </div>
  );
}

export default UserNav;
