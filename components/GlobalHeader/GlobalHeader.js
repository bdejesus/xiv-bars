import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './GlobalHeader.module.scss';

function GlobalHeader() {
  const { data: session } = useSession();

  function handleSignIn() {
    signIn();
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
            A Final Fantasy XIV Endwalker Hotbar Planner
          </div>
        </a>
      </Link>

      <div className={styles.userNav}>
        { session
          ? (
            <>
              <div className={styles.email}>{session.user.email}</div>
              <button type="button" onClick={handleSignOut}>Log out</button>
            </>
          )
          : <button type="button" onClick={handleSignIn}>Login</button>}
      </div>
    </div>
  );
}

export default GlobalHeader;
