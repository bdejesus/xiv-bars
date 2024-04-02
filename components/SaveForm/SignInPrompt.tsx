import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import analytics from 'lib/analytics';
import I18n from 'lib/I18n/locale/en-US';
import styles from './SignInPrompt.module.scss';

export default function SignInPrompt() {
  const router = useRouter();

  function handleSignIn() {
    analytics.event({ action: 'login', params: { method: 'discord' } });
    signIn('discord', { callbackUrl: router.asPath });
  }

  return (
    <div className={styles.prompt}>
      <Image src="/images/mog_trumpet.png" alt="" height={98} width={120} />
      <h3>Sign in to save this layout</h3>
      <button
        type="button"
        onClick={handleSignIn}
        className={`${styles.signin} button btn-primary btn-block`}
      >
        {I18n.UserNav.signin_with_discord}
      </button>

      <ul>
        <li>Save Layouts to your profile.</li>
        <li>Add notes and descriptions.</li>
        <li>Shorter URLs.</li>
      </ul>
    </div>
  );
}
