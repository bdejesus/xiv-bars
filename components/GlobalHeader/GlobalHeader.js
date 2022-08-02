/* eslint-disable jsx-a11y/anchor-is-valid */

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './GlobalHeader.module.scss';

export function GlobalHeader() {
  const { data: session } = useSession();

  function handleSignIn() {
    signIn('google', { callbackUrl: '/' });
  }

  function handleSignOut() {
    signOut();
  }

  return (
    <div className={styles.container}>
      <Link href="/">
        <a className={styles.branding}>
          <div className={styles.logo}>
            <img
              src="/icons/favicon-96x96.png"
              alt="XIVBARS Logo"
              height={24}
              width={24}
            />
          </div>
          <div className={styles.title}>XIVBARS</div>
          <div className={styles.subtitle}>
            A Final Fantasy XIV Cross Hotbar Planner
          </div>
        </a>
      </Link>

      <div className={styles.userNav}>
        { session
          ? (
            <>
              <nav className={styles.nav}>
                <Link href="/player/me">
                  <a>
                    My Layouts
                  </a>
                </Link>
              </nav>

              <div className={styles.email}>
                {session.user.name || session.user.email}
              </div>

              <button
                type="button"
                className={styles.logout}
                href="/api/auth/signout"
                onClick={handleSignOut}
              >
                Log out
              </button>
            </>
          )
          : <button type="button" onClick={handleSignIn}>Sign in</button>}
      </div>
    </div>
  );
}

export default GlobalHeader;
