import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import JobMenu from 'components/JobSelect/JobMenu';
import { JobSelectContextProvider } from 'components/JobSelect/context';

import styles from './Intro.module.scss';

function Intro({ jobs }) {
  return (
    <>
      <div className={styles.header}>
        <Header />
      </div>
      <div className="appView">
        <div className="container">
          <JobSelectContextProvider>
            { jobs.length > 0
              ? (
                <>
                  <h2 className={styles.title} id="jobSelectTitle">
                    Select A Job/Class
                  </h2>
                  <JobMenu jobs={jobs} />
                </>
              )
              : (
                <div className={styles.outage}>
                  <h2 className={styles.title}>Sorry, but something went wrong...</h2>

                  <p>It looks like we can’t retrieve Class and Actions data at this moment due to a server outage affecting the XIVAPI servers.</p>

                  <blockquote>
                    <p>
                      An incident has occured in the OVH strasbourg datacenter, affecting the XIVAPI server.
                    </p>

                    <p>
                      Based on the informations we have, the connection won’t be restored before at least tomorrow and there’s nothing we can do about it.
                    </p>

                    <p>
                      Sorry for the inconvenience, OVH said that the fire has been extinguished and people are safe, just need to wait now.
                    </p>

                  </blockquote>
                  <p>
                    For more info, visit the <a href="https://discord.gg/MFFVHWC">XIVAPI Discord Server</a>.
                  </p>
                </div>
              )}
          </JobSelectContextProvider>
        </div>
      </div>
    </>
  );
}

Intro.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Intro;
