import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './LanguagePicker.module.scss';

export default function LanguagePicker() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <ul>
        <li>
          <Link href={decodeURIComponent(router.pathname)} locale="en">English</Link>
        </li>
        <li>
          <Link href={decodeURIComponent(router.pathname)} locale="ja">日本語</Link>
        </li>
        <li>
          <Link href={decodeURIComponent(router.pathname)} locale="de">Deutsch</Link>
        </li>
        <li>
          <Link href={decodeURIComponent(router.pathname)} locale="fr">Français</Link>
        </li>
      </ul>
    </div>
  );
}
