import { useTranslation } from 'next-i18next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import analytics from 'lib/analytics';
import styles from './SignInPrompt.module.scss';

export default function SignInPrompt() {
  const { t } = useTranslation();
  const router = useRouter();

  function handleSignIn() {
    analytics.event({ action: 'login', params: { method: 'discord' } });
    signIn('discord', { callbackUrl: router.asPath });
  }

  return (
    <div className={styles.prompt}>
      <Image src="/images/mog_trumpet.png" alt="" height={98} width={120} />

      <div className={styles.body}>
        <div>
          <h3>{t('SignInPrompt.sign_in')}</h3>
          <button
            type="button"
            onClick={handleSignIn}
            className="button btn-primary btn-block"
          >
            {t('UserNav.signin_with_discord')}
          </button>
        </div>

        <div>
          <ul>
            <li>{t('SignInPrompt.save_layouts')}</li>
            <li>{t('SignInPrompt.add_notes')}</li>
            <li>{t('SignInPrompt.short_urls')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
