import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './LanguagePicker.module.scss';

export default function LanguagePicker() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <ul>
        <li>
          <Link href={router.asPath} locale="en">English</Link>
        </li>
        <li>
          <Link href={router.asPath} locale="ja">日本語</Link>
        </li>
      </ul>
    </div>
  );
}
