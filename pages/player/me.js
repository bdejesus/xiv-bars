import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import fetch from 'node-fetch';
import Link from 'next/link';
import GlobalHeader from 'components/GlobalHeader';
import JobMenu from 'components/JobSelect/JobMenu';
import { JobSelectContextProvider } from 'components/JobSelect/context';
import Job from 'components/JobSelect/Job';
import { listJobs, } from 'lib/api';

export default function Player(pageProps) {
  const { jobs } = pageProps;
  const [layouts, setLayouts] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/layouts')
      .then((data) => data.json())
      .then((json) => setLayouts(json));
  }, []);

  return (
    <>
      <GlobalHeader />

      { session && session.user && (
        <div className="container section">
          <h1 className="mt-md">
            {session.user.name || session.user.email}
          </h1>
        </div>
      )}

      { layouts.length > 0
        ? (
          <div className="container section">
            <h3>Saved Layouts</h3>
            <ul>
              {layouts.map((layout) => {
                const job = jobs.find((j) => j.ID === layout.jobId);

                return (
                  <li key={layout.id}>
                    <h4>
                      <Link href={`/job/${job.Abbr}/${layout.id}`}>
                        <a>{layout.title}</a>
                      </Link>
                    </h4>
                    <Job job={job} />
                    <div>{layout.description}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="app-view">
            <div className="container">
              <JobSelectContextProvider>
                <h2 id="jobSelectTitle">
                  No Layouts – Create a new one?
                </h2>
                <JobMenu jobs={jobs} />
              </JobSelectContextProvider>
            </div>
          </div>
        )}
    </>
  );
}

Player.getInitialProps = async () => {
  // Get Selected Job
  const decoratedJobs = await listJobs();

  return {
    jobs: decoratedJobs,
  };
};
