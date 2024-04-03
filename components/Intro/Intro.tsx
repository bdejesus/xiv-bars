import { useTranslation } from 'next-i18next';
import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';
import styles from './Intro.module.scss';

interface Props {
  className?: string
}

export default function Intro({ className }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className={[styles.header, className].join(' ')}>
        <Hero />
      </div>

      <div className="app-view">
        <div className="container">
          <h2 className={styles.title} id="jobSelectTitle">
            { t('Intro.select_a_job') }
          </h2>
          <JobMenu />
        </div>
      </div>
    </>
  );
}

Intro.defaultProps = {
  className: ''
};
