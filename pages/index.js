import {
  listJobs,
  listJobActions,
  listRoleActions
} from 'lib/api';
import { group } from 'lib/utils/array';
import Link from 'next/link';
import Image from 'next/image';
import Header from 'components/Header';
import HowTo from 'components/HowTo';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import Intro from 'components/Intro';
import App from 'components/App';
import LoadScreen from 'components/LoadScreen';
import EorzeaProfile from 'components/EorzeaProfile';
import Lore from 'components/Lore';
import shortDesc from 'lib/shortDesc';
import I18n from 'lib/I18n/locale/en-US';

import styles from './Index.module.scss';

function Index(pageProps) {
  const { actions, jobs, selectedJob } = pageProps;

  const Body = () => (
    <>
      <HowTo />
      <EorzeaProfile />
      <Articles />
    </>
  );

  const Home = () => (
    <>
      <Intro jobs={jobs} />
      <Body />
    </>
  );

  const JobClass = () => (
    <>
      <App {...pageProps} />

      <div className={styles.articles}>
        <div className={`${styles.main} container`}>
          <h1 className={styles.title}>
            {selectedJob.Name} {I18n.Global.title}
          </h1>

          <p className={styles.jobDesc}>
            {shortDesc(selectedJob, actions)}
          </p>

          <Lore selectedJob={selectedJob} />
        </div>

        <Header primary={(!selectedJob)} />
        <Body />
      </div>
    </>
  );

  return (
    <>
      <div className={styles.view}>
        <div className={styles.header}>
          <Link href="/">
            <a className={styles.branding}>
              <Image
                src="/icons/favicon-96x96.png"
                alt="XIVBARS Logo"
                height={24}
                width={24}
              />
              <b className={styles.title}>XIVBARS</b>
              <span className={styles.subTitle}>
                A Final Fantasy XIV Endwalker Hotbar Planner
              </span>
            </a>
          </Link>
        </div>

        { !selectedJob ? <Home /> : <JobClass /> }

      </div>

      <Footer />
      <LoadScreen />
    </>
  );
}

Index.getInitialProps = async ({ req, query }) => {
  const { s1, s } = query;
  const host = (typeof req !== 'undefined')
    ? req.headers.host
    : 'https://xivbars.bejezus.com';

  // Decode Slots query param
  const encodedSlots = () => {
    if (s1) return group(query.s1.split(','), 16);
    if (s) return JSON.parse(s);
    return undefined;
  };

  // Get Selected Job
  const decoratedJobs = await listJobs();
  const selectedJob = query.job
    ? decoratedJobs.find((job) => job.Abbr === query.job)
    : null;

  let jobActions = [];
  let roleActions = [];

  // Fetch Actions
  if (selectedJob) {
    jobActions = await listJobActions(selectedJob);
    // TODO: Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
    if (selectedJob.Role) {
      roleActions = await listRoleActions(selectedJob);
    }
  }

  return {
    jobs: decoratedJobs,
    actions: jobActions,
    selectedJob,
    roleActions,
    encodedSlots: encodedSlots(),
    host
  };
};

export default Index;
